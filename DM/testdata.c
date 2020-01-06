
#include <sys/types.h>
#include <stdio.h>      /* for printf() and fprintf() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <errno.h>
#include <sys/fcntl.h>
#include <pthread.h>
#include <sys/socket.h> /* for socket() and bind() */
#include <arpa/inet.h>  /* for sockaddr_in and inet_ntoa() */
#include <semaphore.h>
#include <sys/mman.h>
#include <string.h>     /* for memset() */
#include <unistd.h>     /* for close() */
#include <sys/select.h>
#include "bool.h"
#include "testdata.h"


double randomize(double var);
void sendoverUDP(char *mystring);

int
main(int argc,char *argv[])
{


	double TDSvalue=500.0;
	double turbidityvalue=100;
	double pHvalue=7.0;
	double flow=(2*5280/3600.0)*((2.54*12)/100.0);
	double rad=10;
	double k;
	time_t timestamp;
	char mystring[512];
	bool tosocket;

	if( (argc > 1) && (strcmp(argv[1],"-udp")==0)){
		tosocket=true;
	}
	else{
		tosocket=false;
	}

	timestamp=time(NULL)-(BACKINTIME*3600);

	while(time(NULL) > timestamp) {

		usleep(1000);
		timestamp+=SAMPLEINTERVAL;

		TDSvalue=randomize(TDSvalue);
		if(TDSvalue >1000)
			TDSvalue=1000;
		else if(TDSvalue < 0)
			TDSvalue=0;

		turbidityvalue=randomize(turbidityvalue);;
		if(turbidityvalue >3000)
			turbidityvalue=3000;
		else if(turbidityvalue < 0)
			turbidityvalue=0;

		pHvalue=randomize(pHvalue);
		if(pHvalue >12)
			pHvalue=12;
		else if(pHvalue < 3)
			pHvalue=3;

		flow=randomize(flow);
		if(flow >20)
			flow=20;
		else if(flow < 0)
			flow=0;

		rad=randomize(rad);;
		if(rad >10000)
			rad=10000;
		else if(rad < 0)
			rad=0;
		
		sprintf(mystring,
		    "NodeID_1,Location=Arboretum TDS=%.2f,Turbidity=%.2f,PH=%.2f,Flow=%.2f,Radiation=%.2f %ld000000000\n",
				TDSvalue,
				turbidityvalue,
				pHvalue,
				flow,
				rad,
				timestamp
		);

		if(tosocket)
			sendoverUDP(mystring);
		else
			printf("%s",mystring);
	}
}
	
double 
randomize(double var){
	double k;
	k=(((rand()/(float)(RAND_MAX)))-0.5)*2;
	/* restrict random number now between -1 and 1 to 10% of its range */
	k=(k*(CHG_PERCENT/100.0))+1.0;
	return(var*k);
}

void
sendoverUDP(char *mystring){
	#include <sys/types.h>
	#include <stdio.h>      /* for printf() and fprintf() */
	#include <stdlib.h>     /* for atoi() and exit() */
	#include <errno.h>
	#include <sys/fcntl.h>
	#include <pthread.h>
	#include <sys/socket.h> /* for socket() and bind() */
	#include <arpa/inet.h>  /* for sockaddr_in and inet_ntoa() */
	#include <semaphore.h>
	#include <sys/mman.h>
	#include <string.h>     /* for memset() */
	#include <unistd.h>     /* for close() */
	#include <sys/select.h>
	#include "bool.h"

#define MAXSIZE 512

    int sock;                        /* holds the network Socket */
    struct sockaddr_in RemoteIP; 	/* Incoming Remote (from) IP address */
    char outgoingBuf[MAXSIZE];        /* Buffer for received data  */
    unsigned short SendToPort;     /*  Port to forward messages to */
    int outgoingsize;

	outgoingsize=strlen(mystring+1);
    SendToPort=SENSE_OUTPORT;

    /* Create socket for sending datagrams */
    if ((sock = socket(PF_INET, SOCK_DGRAM , IPPROTO_UDP)) < 0){
		fprintf(stderr,"UDPengine: socket() call failed\n");
    		exit(1);
    }


    inet_aton(SENSE_OUTADDR, &RemoteIP.sin_addr);
    RemoteIP.sin_port = htons(SendToPort);
		
        /* Send received datagram back to the client */
        if (sendto(sock, mystring, outgoingsize, 0, 
             (struct sockaddr *) &RemoteIP, sizeof(RemoteIP)) != outgoingsize){
            fprintf(stderr,"sendto() sent a different number of bytes than expected\n");
	    exit(1);

        }

}  //end main

