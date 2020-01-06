
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
	double turbidityvalue=5.0;
	double pHvalue=7.0;
	double flow=(2*5280/3600.0)*((2.54*12)/100.0);
	double rad=1;
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

		sleep(10);
		timestamp+=SAMPLEINTERVAL;
		TDSvalue=randomize(TDSvalue);
		turbidityvalue=randomize(turbidityvalue);;
		pHvalue=randomize(pHvalue);
		flow=randomize(flow);
		rad=randomize(rad);;
		
		sprintf(mystring,
		    "NodeID_1,Location=Arboretum TDS=%.2f,Turbidity=%.2f,PH=%.2f,Flow=%.2f,Radiation=%.2f %ld\n",
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
	k=((rand()/(float)(RAND_MAX/2)))-1.0;
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

