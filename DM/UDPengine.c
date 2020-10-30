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
#include <signal.h>     
#include <unistd.h>     /* for close() */
#include <sys/select.h>
#include <bool.h>
#include <utils.h>
#include <netcomms.h>
#include <protocol.h>
#include <servercomms.h>

void interrupt_handler (int signum);
int setuphankcomms(unsigned short hankport);
void setupDBcomms( 
	unsigned char *ipaddr,	//address to connect to
	unsigned short port	//port to connect to
	);

bool recvFromDB(void);
bool sendToDB(char *message);
bool doconnect(void);
bool sendHello(void);
extern bool connected;
extern int back_fd;

extern int errfd;
void lockfiles( unsigned short hankPort);
bool unlockfiles( unsigned short hankPort);

//error routine in utils.c
// routine to output binary in outputbin.c
void outputBin( unsigned char *buf, int length);
int parsedata(char *,char *,int);

long messagecnt = 0;	//count of incoming messages

/* global so everyone always gets the latest copy after any */
/* data/command that touches deviceID */
/* this is the unique identifier for each hank */
char deviceID[64]="UnInitialized";

extern int dbsock;		/* holds the network socket for dbase */
int hanksock;   	     /* holds the network for hank */
unsigned short hankPort;     /* Port to listen device must be 
				global cause referenced in interrupt routine */
struct sockaddr_in RemoteIP; /* IP address struct for talking to hank */
struct sockaddr_in controlDBIp; /* IP address struct for talking to dbase */


int 
main(int argc, char *argv[])
{
    unsigned int cliAddrLen;     /* Length of incoming message */
    char incomingBuf[MAXSIZE];   /* Buffer for received data  */
    char outgoingBuf[DBPACKETSIZE+1];   /* Buffer for received data  */
					/* +1 is for a \0 so we can
					   use prints on this buf
					   never use sizeof, only
					   DBPACKETSIZE for sizing */
    unsigned short dbPort;       /* Port to forward messages to DB*/
    int recvMsgSize;             /* Size of received message */
    char *cptr,*dptr; 		 /* misc char ptrs to parse messages */

    int timeouts;
    time_t lasttime;		/* for timeing reconnect attempts */

    struct timeval tv;		 /* for holding timeouts */
    unsigned long long nanosecs;
				    	
    char errbuf[MAXSIZE];	    /* a buffer for storing error messages */
    int outgoingsize;

    //used with select
    fd_set rfds;	/* file descriptors array for use with select */	
    int rnum;
    int retval;

//for debug only
//errfd=1;

    if(argc < 4){
	    fprintf(stderr,"Usage: %s [ DevicePort ]  [ Dbaseservice Address ] [ Dbaseservice Port ]",argv[0]);
	    exit(1);
    }
    
    /* local port on which to listen for hank */
    sscanf(argv[1],"%hd",&hankPort); 
    logfileseed=hankPort;

    /* create a lockfile to block multiple copies of UDPengine on same port */
    lockfiles(hankPort);

    /* localhost port to talk to control/dbase program */
    sscanf(argv[3],"%hd",&dbPort);
    
    g_err(NOEXIT,NOPERROR,
	    "Starting UDP DM:  listen on %d,  write to %s:%d\n",
	    hankPort,argv[2],dbPort);
    
    /* keep going on hangups/logouts */
    signal(SIGHUP,SIG_IGN);
    /* catch signals and cntr-C so can clean up nicely */
    signal (SIGINT, interrupt_handler);
    signal (SIGQUIT, interrupt_handler);
    signal (SIGPIPE, interrupt_handler);
    signal (SIGTERM, interrupt_handler);
    signal (SIGUSR1, interrupt_handler);




    if((hanksock=setuphankcomms( hankPort ))<0){
	fprintf(stderr,"FATAL: can't open hank port\n");
	g_err(EXIT,NOPERROR,"FATAL: can't open hank port\n");
    }

    /* init the control/dbase port */
    /* dbase is a TCP, not UDP port */
    setupDBcomms(argv[2],dbPort);
  
    timeouts=0;
    lasttime=time(NULL);
    /* main loop, runs forever */
    while (true){

	/*if(connected)
		g_err(NOEXIT,NOPERROR,"loop connected = true");
	else
		g_err(NOEXIT,NOPERROR,"loop connected = false");
	*/

	/* set up to select when socket ready to read */
	/* get the biggest file desc for select call */
	FD_ZERO(&rfds);
	FD_SET(hanksock,&rfds);
	rnum = hanksock;

	if(connected){
		FD_SET(dbsock,&rfds);
		rnum = (hanksock>dbsock) ? hanksock : dbsock;
	}
g_err(NOEXIT,NOPERROR,"dbsock: %d  hanksock: %d rnum: %d",
			dbsock,hanksock,rnum);
	/* Setting timeout as defensive measure 
	   timeout and bring us back from blocking on data wait 
	   have to init timeout every time cause select modifies */
	tv.tv_sec = CLIENTWAITSECS; /*  timeout for receiving a request */
	tv.tv_usec= 0;                                                       

	retval=select(rnum+1,&rfds,NULL,NULL,&tv);
	switch(retval){
	    case -1:
		g_err(NOEXIT,PERROR,"select() failed");
		break;
	    case 0:
		g_err(NOEXIT,NOPERROR,
			"\nWARNING: Timeout #%d on select\n",
			timeouts++);
		break;

	    default:

		/* something hit so mark it */
		timeouts=0;

	        /* did the hank socket hit */
	        //HANK SERVICE
		if( FD_ISSET(hanksock,&rfds) ){
		    /* receive message from a client */
		    /* Set the size of the in-out parameter */
	
    	    	    cliAddrLen = sizeof(RemoteIP);
		
		    if ((recvMsgSize = recvfrom(hanksock, incomingBuf, MAXSIZE, 
			0, (struct sockaddr *) &RemoteIP, &cliAddrLen)) < 0){
			    g_err(EXIT,PERROR,"**ERR:recvfrom() failed");
		    }

		    incomingBuf[recvMsgSize]='\0';
    
		    g_err(NOEXIT,NOPERROR,"hank->UDP:%d: [ %s ]",
					recvMsgSize, incomingBuf);

		    messagecnt++;

		    //echo out what was just received for debug 
		    //outputBin((unsigned char *)incomingBuf,recvMsgSize);
		
		    /* Manipulate Data 
		     * incoming stream is in incomingBuf,  its size is recvMsgSize 
		     * modify and place in outgoingBuf with parsedata 
		     * parsedata returns +size for send to control/db program 
		     * -size for send back to tankmon/hank in field
		     * 0 for do nothing
		     */
    
		    //to dbase or control?
		    if((outgoingsize=parsedata(incomingBuf,outgoingBuf,
			DBPACKETSIZE)) > 0){

			    /* Send received datagram to the control database program */
			    outgoingBuf[DBPACKETSIZE]='\0';
			    g_err(NOEXIT,NOPERROR,"UDP->DB:%d: [ %s ]",
					outgoingsize, outgoingBuf);

			    sendToDB(outgoingBuf);
		    }
    
		    //boomerang back to hank
		    else if(outgoingsize < 0){
			    outgoingsize *= -1;
			    g_err(NOEXIT,NOPERROR,"UDP->hank:%d: [ %s ]",
					outgoingsize, outgoingBuf);

			    if (sendto(hanksock, outgoingBuf, outgoingsize, 0, 
			        (struct sockaddr *) &RemoteIP, 
				sizeof(RemoteIP)) != outgoingsize){
			       	     g_err(NOEXIT,PERROR,
			             "sendto() diff #bytes thank expected to Hank");
			    }
		    }
    
		}//END HANK SERVICE
    
		/* did the db sock  */
		if( FD_ISSET(dbsock,&rfds) ){
			g_err(NOEXIT,NOPERROR,"receive socket hit\n");
			recvFromDB();
		}
			
	}  //end switch on retval

	
	/* see if we need to reconnect to a dead dbase */
	/* only try this every DBASECHKINT seconds */
	/* other data goes in backup file in meantime */
	if((time(NULL)-lasttime) > DBASECHKINT){
		lasttime=time(NULL);
		if(!connected){
			doconnect();
		}
		sendHello();
	}

    }//end while

}  //end main


int 
setuphankcomms(unsigned short hankport)
{
    int sock;
    struct sockaddr_in LocalIP;  /* local bind to address */
    /* Create socket for sending/receiving datagrams */
    if ((sock = socket(PF_INET, SOCK_DGRAM , IPPROTO_UDP)) < 0){
		g_err(NOEXIT,PERROR,"UDPengine: socket() call failed");
		return(-1);
	}

    /* Construct local address structure */

    /* Zero out structure */
    memset(&LocalIP, 0, sizeof(LocalIP));        

    /* Internet address family */
    LocalIP.sin_family = AF_INET;             	 

    /* Any incoming interface (in case of multiple 
    network cards like wireless and ether) */
    LocalIP.sin_addr.s_addr = htonl(INADDR_ANY); 
    LocalIP.sin_port = htons(hankport);      /* Local port */


    /* Got a socket, now Bind to the local address and port */
    if (bind(sock, (struct sockaddr *) &LocalIP, sizeof(LocalIP)) < 0){
        g_err(NOEXIT,PERROR,"UDPengine: bind() call failed");
	return(-1);
    }
    return(sock);
}

bool
hankCommand(unsigned char *command,
	int cmndsize, 
	const char *requestor)
{
    int outsize;
    g_err(NOEXIT,NOPERROR,"CMND:%s: UDP->hank:%d: [ %s ]",
		requestor,cmndsize, command);
    if (sendto(hanksock, command, cmndsize, 0, 
	(struct sockaddr *) &RemoteIP, 
	sizeof(RemoteIP)) != cmndsize){
	     g_err(NOEXIT,PERROR,
	     "%s: sendto() diff #bytes than expected to Hank",
			__FUNCTION__);
		return(false);
    }
    else
	return(true);
}


/* Interrupt_handler so that CTRL +C can be used to exit the program */
void 
interrupt_handler (int signum) {
	close(dbsock);
	close(back_fd);
	close(hanksock);
	unlockfiles(hankPort);

	if(signum == SIGUSR1){
		g_err(EXIT,NOPERROR,
		"UDPengine Process %d on port %d\nExit request by new engine\nGoodbye\n",
			getpid(),
			hankPort);
	}
	else
		g_err(EXIT,NOPERROR,"\nSIGNAL %d!!\nCleanup Done\nGoodbye\n",signum);
}

