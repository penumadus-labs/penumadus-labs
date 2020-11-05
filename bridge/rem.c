
#include <sys/types.h>
#include <stdio.h>      /* for printf() and fprintf() */
#include <stdlib.h>
#include <errno.h>
#include <sys/fcntl.h>
#include <pthread.h>
#include <sys/socket.h> /* for socket() and bind() */
#include <arpa/inet.h>  /* for sockaddr_in and inet_ntoa() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <semaphore.h>
#include <sys/mman.h>
#include <string.h>     /* for memset() */
#include <unistd.h>     /* for close() */
#include <sys/select.h>
#include <sys/signal.h>
#include <sys/time.h>
#include <math.h>
#include <utils.h>
#include <bool.h>
#include <netcomms.h>
#include <xbee.h>
#include <xbeeintfc.h>
#include <trans.h>
#include <aqueues.h>

void *processrem(void *arg);
void *processdef(void *arg);
int setupListener(unsigned short port);

/* read UDP packets from the two remotes and call processing */
void
setupRemotes(void)
{
	pthread_t remthread;

	/* start rem0 read thread */
	g_err(NOEXIT,NOPERROR,"Start 0");
	if(pthread_create(&remthread,NULL,&processrem,(void *)(REM0PORT)) != 0)
		g_err(EXIT,PERROR,"Could not create reader thread %d\n",REM0PORT);

	g_err(NOEXIT,NOPERROR,"Start 1");
	/* start rem1 read thread */
	if(pthread_create(&remthread,NULL,&processrem,(void *)(REM1PORT)) != 0)
		g_err(EXIT,PERROR,"Could not create reader thread %d\n",REM1PORT);

	g_err(NOEXIT,NOPERROR,"Start 2");
	/* start rem2 read thread */
	if(pthread_create(&remthread,NULL,&processdef,(void *)(REM2PORT)) != 0)
		g_err(EXIT,PERROR,"Could not create reader thread %d\n",REM2PORT);

}


/* worker thread,  one per remote */
void 
*processrem(void *arg)
{
	char tmpbuf[BIGBUF];
	int recvMsgSize;
	unsigned short locport;
	int remSock;
	struct sockaddr_in RemoteIP; /* IP address struct for incoming message */
	int len;
	AccelerationPacketQueue remQueue;;
	struct remdata pack;
	struct timeval synctime;
	unsigned long basemillis=0;
	unsigned long millis,lastmillis;
	bool timesynced=false;
	unsigned long secs, usecs;

	locport=(unsigned short)((intptr_t)arg);

	//so id becomes morganbridge:0 for rem0 and :1 for rem1 etc 
	sprintf(remQueue.id,"%s:%d",BRIDGEID,locport-REM0PORT);

	/* possible race here so sleep 2 sec between thread starts above */
	remSock=setupListener(locport);
	g_err(NOEXIT,NOPERROR,"Remote listener started on port %d\n",locport);


	while(true){
		if ((recvMsgSize = recvfrom(remSock, tmpbuf, BIGBUF,
                        0, (struct sockaddr *) &RemoteIP, &len)) < 0){
                            g_err(EXIT,PERROR,"**ERR:recvfrom() on %d failed",locport);
                }

	        tmpbuf[recvMsgSize]='\0';
		//fprintf(stderr,"Recv From Remote %s:%d [%s]\n",
			 //inet_ntoa(RemoteIP.sin_addr),locport,tmpbuf);

		sscanf(tmpbuf,"%lu %f %f %f %f %f %f %f %f %f",
				&millis,
				&pack.accel.x,
				&pack.accel.y,
				&pack.accel.z,
				&pack.mag.x,
				&pack.mag.y,
				&pack.mag.z,
				&pack.gyro.x,
				&pack.gyro.y,
				&pack.gyro.z
		);
	

		//the remotes have no sense of clock time so have to interpolate here
		if(!timesynced || (millis <= lastmillis)){
			basemillis=millis;
			gettimeofday(&synctime,NULL);
			timesynced=true;
		}
		lastmillis=millis;
		
		//get millis passed since time recorded
		millis-=basemillis;

		//adjust seconds and microsecs by number of millis since basemillis
		secs=synctime.tv_sec+(millis/1000);

		usecs=synctime.tv_usec+((millis%1000)*1000);
		if(usecs >= 1000000){
			usecs-= 1000000;
			secs++;
		}
		
		//call handle data accell processing and send data with sendData A packets
		//fprintf(stderr,"TIME:  %lx %lx\n",secs,usecs);
		handleData(&remQueue, pack.accel.x, pack.accel.y, pack.accel.z, secs, usecs);
		//call magnetometer processing and update carcount
	}
}


/* worker for deflection */
void 
*processdef(void *arg)
{
	char tmpbuf[BIGBUF];
	int recvMsgSize;
	unsigned short locport;
	int remSock;
	struct sockaddr_in RemoteIP; /* IP address struct for incoming message */
	int len;
	struct timeval synctime;
	unsigned long basemillis=0;
	unsigned long millis,lastmillis;
	bool timesynced=false;
	unsigned long secs, usecs;
	float ldef;
	float deflection=0;
	time_t lastsend=0;

	locport=(unsigned short)((intptr_t)arg);

	/* possible race here so sleep 2 sec between thread starts above */
	remSock=setupListener(locport);
	g_err(NOEXIT,NOPERROR,"Remote listener started on port %d\n",locport);


	while(true){
		if ((recvMsgSize = recvfrom(remSock, tmpbuf, BIGBUF,
                        0, (struct sockaddr *) &RemoteIP, &len)) < 0){
                            g_err(EXIT,PERROR,"**ERR:recvfrom() on %d failed",locport);
                }

	        tmpbuf[recvMsgSize]='\0';
		fprintf(stderr,"Recv From Remote %s:%d [%s]\n",
			 inet_ntoa(RemoteIP.sin_addr),locport,tmpbuf);

		sscanf(tmpbuf,"%lu %f", &millis, &ldef);

		//the remotes have no sense of clock time so have to interpolate here
		if(!timesynced || (millis <= lastmillis)){
			basemillis=millis;
			gettimeofday(&synctime,NULL);
			timesynced=true;
		}
		lastmillis=millis;
		
		//get millis passed since time recorded
		millis-=basemillis;

		//adjust seconds and microsecs by number of millis since basemillis
		secs=synctime.tv_sec+(millis/1000);

		usecs=synctime.tv_usec+((millis%1000)*1000);
		if(usecs >= 1000000){
			usecs-= 1000000;
			secs++;
		}
		
		/* more than a 100 micron diff, or too long since send, send a deflection packet */
		if( (fabsf(ldef-deflection) > .1) || ((time(NULL)-lastsend) > DEFLTDEFLECTSEND) ){

			deflection=ldef;
			lastsend=time(NULL);

			/* construct and send packet to server */
			/* ID gets a .D to indcate deflection masquerading as a bridgedata packet */
			sprintf(tmpbuf,"%s %s %.2f %lx %lx %x",
			"b",
			BRIDGEID,
			deflection,
			(long)secs,
			(long)usecs,
			msgnum++
			);

			sendData(tmpbuf);
		}

	}
}



/* open and bind a listener on a socket */
int 
setupListener(unsigned short port)
{
    int sock;
    struct sockaddr_in LocalIP;  /* local bind to address */
    /* Create socket for sending/receiving datagrams */
    if ((sock = socket(PF_INET, SOCK_DGRAM , IPPROTO_UDP)) < 0){
                g_err(EXIT,PERROR,"%s: socket() call failed",__FUNCTION__);
        }

    /* Construct local address structure */

    /* Zero out structure */
    memset(&LocalIP, 0, sizeof(LocalIP));

    /* Internet address family */
    LocalIP.sin_family = AF_INET;

    /* Any incoming interface (in case of multiple 
    network cards like wireless and ether) */
    LocalIP.sin_addr.s_addr = htonl(INADDR_ANY);
    LocalIP.sin_port = htons(port);      /* Local port */


    /* Got a socket, now Bind to the local address and port */
    if (bind(sock, (struct sockaddr *) &LocalIP, sizeof(LocalIP)) < 0){
        g_err(EXIT,PERROR,"%s: bind() call failed",__FUNCTION__);
    }

    return(sock);
}
