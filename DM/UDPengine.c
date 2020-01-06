/* daemon to monitor UDP port INPORT,  process data, and forward to port OUTPORT
*	this program is made as simple as possible so as to be readable and
*	understandable for those new to network code in C. 
*	the original contained a complete scheduler and
*	dispatcher which we may grow into later.
*	Copyright 2019 G. Laggis and StrataG.  all rights reserved
*/

/* system header files,  standard stuff */
#include <sys/types.h>
#include <stdio.h>      /* for printf() and fprintf() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <errno.h>
#include <sys/fcntl.h>
#include <sys/time.h>
#include <pthread.h>
#include <sys/socket.h> /* for socket() and bind() */
#include <arpa/inet.h>  /* for sockaddr_in and inet_ntoa() */
#include <semaphore.h>
#include <sys/mman.h>
#include <string.h>     /* for memset() */
#include <unistd.h>     /* for close() */
#include <sys/select.h>
#include <bool.h>
#include <config.h>


extern int errfd;

//error routine in utils.c
void g_err( char * errbuf, bool EXITSTAT, bool PERRNO);
// routine to output binary in outputbin.c
void outputBin( unsigned char *buf, int length);
int parsedata(char *,char *,int);

long messagecnt = 0;	//count of incoming messages

char *timereq = "C TIME?";
const int timereqsize=7; //microsecs

int 
main(int argc, char *argv[])
{
    int sock;                        	/* holds the network Socket */
    struct sockaddr_in LocalIP; 	/* Local IP address */
    struct sockaddr_in RemoteIP; 	/* Incoming Remote (from) IP address */
    unsigned int cliAddrLen;         	/* Length of incoming message */
    char incomingBuf[MAXSIZE];        	/* Buffer for received data  */
    char outgoingBuf[MAXSIZE];        	/* Buffer for received data  */
    unsigned short ListenOnPort;     	/* Port to listen for messages on  */
    unsigned short SendToPort;  	/* Port to forward messages to */
    int recvMsgSize;                 	/* Size of received message */
    char *cptr,*dptr; 			/* misc char ptrs to parse messages */

    struct timeval tv;			/* for holding time for syncing with sensors */
    unsigned long long nanosecs;
				    	
    char errbuf[MAXSIZE];		/* a buffer for storing error messages */
    int outgoingsize;

//for debug only
//errfd=1;

    ListenOnPort = SENSE_INPORT;  /* local port on which to listen*/
    SendToPort=SENSE_OUTPORT;

	sprintf(errbuf,
		"Starting UDP DM:  listen on %d,  write to %d\n",ListenOnPort,SendToPort);
	g_err(errbuf,false,false);

    /* Create socket for sending/receiving datagrams */
    if ((sock = socket(PF_INET, SOCK_DGRAM , IPPROTO_UDP)) < 0)
        g_err("UDPengine: socket() call failed",true,true);

    /* Construct local address structure */
    memset(&LocalIP, 0, sizeof(LocalIP));        /* Zero out structure */
    LocalIP.sin_family = AF_INET;             	 /* Internet address family */
    LocalIP.sin_addr.s_addr = htonl(INADDR_ANY); /* Any incoming interface (in case of multiple 
						    network cards like wireless and ether) */
    LocalIP.sin_port = htons(ListenOnPort);      /* Local port */


    /* Got a socket, now Bind to the local address and port */
    if (bind(sock, (struct sockaddr *) &LocalIP, sizeof(LocalIP)) < 0)
        g_err("UDPengine: bind() call failed",true,true);
  

    /* main loop, runs forever */
    while (true){

		/* receive message from a client */
		/* Set the size of the in-out parameter */
	
    	    	cliAddrLen = sizeof(RemoteIP);
		
		if ((recvMsgSize = recvfrom(sock, incomingBuf, MAXSIZE, 0,
		    (struct sockaddr *) &RemoteIP, &cliAddrLen)) < 0){
			    g_err("recvfrom() failed",false,true);
		}

		/* terminate the buffer */
		incomingBuf[recvMsgSize]='\0';

		sprintf(errbuf,"Handling client %s local msg#: %ld\n",
			inet_ntoa(RemoteIP.sin_addr),messagecnt);
		g_err(errbuf,false,false);
		messagecnt++;

		//echo out what was just received for debug 
		//outputBin((unsigned char *)incomingBuf,recvMsgSize);

		/* PONDSCUM this should be in a separate function for processing commands*/
		/* it begins with a C see parsedata, change */
		/* did we get a time request? */
		if(timereqsize <= recvMsgSize){

			if(strncmp(incomingBuf,timereq,timereqsize)==0){
				if(gettimeofday(&tv,NULL) < 0){
					g_err("time sync failed",false,true);
				}

				/* get the current time and echo pack to sender */
				
				outgoingsize = sprintf(outgoingBuf,"<t=%ld %ld>",
					(unsigned long)tv.tv_sec,
					tv.tv_usec);

				if (sendto(sock,
				    outgoingBuf,
				    outgoingsize,
				    0, 
				    (struct sockaddr *) &RemoteIP,
				    sizeof(RemoteIP)) != outgoingsize)
				{
				    g_err("sendto() sent a different number of bytes than expected",
						false,true);
				}
				g_err("***********   SYNCED TIME *************\n",false,false);
				continue;
			}
		}

		
		/* Manipulate Data */
		/* incoming stream is in incomingBuf,  its size is recvMsgSize */
		/* modify and place in outgoingBuf */

		if((outgoingsize=parsedata(incomingBuf,outgoingBuf,recvMsgSize)) != 0){

			//change remote IP and port to destination IP and port
			//and pass it on
			inet_aton(SENSE_OUTADDR, &RemoteIP.sin_addr);
			// deprecated RemoteIP.sin_addr.s_addr=inet_addr(SENSE_OUTADDR);
			RemoteIP.sin_port = htons(SendToPort);
			
			/* Send received datagram to the database */
			if (sendto(sock, outgoingBuf, outgoingsize, 0, 
			     (struct sockaddr *) &RemoteIP, sizeof(RemoteIP)) != outgoingsize){
			    g_err("sendto() sent a different number of bytes than expected",false,true);

			}
		}
    }

}  //end main

