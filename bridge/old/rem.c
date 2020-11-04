
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
#include <utils.h>
#include <bool.h>
#include <netcomms.h>
#include <xbee.h>
#include <xbeeintfc.h>
#include <trans.h>

void *processrem(void *arg);
int setupListener(unsigned short port);

/* read UDP packets from the two remotes and call processing */
void
setupRemotes(void)
{
	pthread_t remthread;
	unsigned int port;

	/* start rem0 read thread */
	g_err(NOEXIT,NOPERROR,"Start 0");
	port=REM0PORT;
	if(pthread_create(&remthread,NULL,&processrem,(void *)(port)) != 0)
		g_err(EXIT,PERROR,"Could not create reader thread %d\n",port);

	g_err(NOEXIT,NOPERROR,"Start 1");
	/* start rem1 read thread */
	port=REM1PORT;
	if(pthread_create(&remthread,NULL,&processrem,(void *)(port)) != 0)
		g_err(EXIT,PERROR,"Could not create reader thread %d\n",port);
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

	locport=(unsigned int)arg;
	/* possible race here so sleep 2 sec between thread starts above */
	remSock=setupListener(locport);
	g_err(NOEXIT,NOPERROR,"Remote listener started on port %d\n",locport);


	while(true){
		if ((recvMsgSize = recvfrom(remSock, tmpbuf, BIGBUF,
                        0, (struct sockaddr *) &RemoteIP, &len)) < 0){
                            g_err(EXIT,PERROR,"**ERR:recvfrom() on %d failed",locport);
                }

	        tmpbuf[recvMsgSize]='\0';
		printf("Recv From Remote %s:%d [%s]\n",
			 inet_ntoa(RemoteIP.sin_addr),locport,tmpbuf);

		//call accell processing and send data with sendData A packets
		//call magnetometer processing and update carcount
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

