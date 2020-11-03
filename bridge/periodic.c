
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
#include <utils.h>
#include <bool.h>
#include <netcomms.h>
#include <xbee.h>
#include <xbeeintfc.h>
#include <trans.h>

void *periodic(void *arg);

unsigned long carcount;

/* periodic is the main worker thread that wakes up every TICKS counts */
/* it reads temps, count, and stuffs into queue to be sent to UDPengine */
/* acceleration packets mimic old hank packets so don't go through here */

void
setupPeriodic(void)
{
	pthread_t periodicthread;
	unsigned int port;

	/* start periodic thread */
	if(pthread_create(&periodicthread,NULL,&periodic,(void *)(NULL)) != 0)
		g_err(EXIT,PERROR,"Could not create periodic thread \n");
}

/* gather temp data every TICKS seconds and send to server */
void *
periodic(void *arg)
{
	unsigned char buf[BIGBUF];
	unsigned char filebuf[256];
	int i;
	int itemp;
	int fd;
	int msgnum=0;
	struct timeval now;
	int numentries;

	struct tempdata temps[] = {		//the temp sensor array with defaults set
		"28-012018C0083B", 1.0,	//T1
		"28-0120191D70C6", 2.0,	//T2
		"28-0120191EB0C0", 3.0,	//T3
		"28-012019180437", 4.0,	//T4
		"28-01201902D316", 5.0,	//T5
		"28-0120191F5827", 6.0,	//T6
		"28-01201910ECDB", 7.0,	//T7
		"28-012019266FA5", 8.0,	//T8
		"28-0306977992b2", 0.0,  	//AMB
		"28-0306977992b2", 0.0,  	//HUMIDITY
	} ;

	
	numentries=sizeof(temps)/sizeof(struct tempdata);

	/* do forever */
	while(true){

		/* fill the temps array with sensor data */
//PONDSCUM
		//for(i=0;i<numentries; i++){
		for(i=8;i<numentries; i++){
			sprintf(filebuf,"/sys/bus/w1/devices/%s/temperature",temps[i].serno);
			if((fd=open(filebuf,O_RDONLY))<0){
				g_err(NOEXIT,PERROR,"%s: Could not open [%s]\n",
					__FUNCTION__,filebuf);
			}
			else{
				read(fd,buf,sizeof(buf));
				sscanf(buf,"%d",&itemp);
				temps[i].temp_humid=(float)(itemp/1000.0);
				close(fd);
			}
		}
			


		/* get the time */
		gettimeofday(&now,NULL);
			
		/* construct and send packet to server */
		sprintf(buf,"%s %s %.1f %.1f %.1f %.1f %.1f %.1f %.1f %.1f %.1f %d %ld %lx %lx %x",
			"B",
			"morganbridge",
			temps[T0].temp_humid,
			temps[T1].temp_humid,
			temps[T2].temp_humid,
			temps[T3].temp_humid,
			temps[T4].temp_humid,
			temps[T5].temp_humid,
			temps[T6].temp_humid,
			temps[T7].temp_humid,
			temps[AMB].temp_humid,
			(int)(temps[HUMIDITY].temp_humid),
			carcount,
			(long)now.tv_sec,
			(long)now.tv_usec,
			msgnum++
		);
		sendData(buf);
		sleep(TICKS);
	}
}
