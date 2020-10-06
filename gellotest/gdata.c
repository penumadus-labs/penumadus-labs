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
#include <utils.h>
#include <netcomms.h>
#include <protocol.h>
#include <servercomms.h>

void setupDBcomms( 
	unsigned char *ipaddr,	//address to connect to
	unsigned short port	//port to connect to
	);

bool recvFromDB(void);
bool sendToDB(char *message);
bool doconnect(void);
bool sendHello(void);
extern bool connected;

extern int errfd;
#define PADCHAR 'v'

unsigned long pacnum;

extern int dbsock;		/* holds the network socket for dbase */
struct sockaddr_in controlDBIp; /* IP address struct for talking to dbase */

int 
main(int argc, char *argv[])
{
    char outgoing[DBPACKETSIZE+1];   /* Buffer for received data  */
					/* +1 is for a \0 so we can
					   use prints on this buf
					   never use sizeof, only
					   DBPACKETSIZE for sizing */
    unsigned short dbPort;       /* Port to forward messages to DB*/
    long i,n;
    static double simpress=5000.0;
    double osimpress;
    double rnum;
    time_t secs;
    time_t rsecs;
    unsigned long microsecs;
    unsigned long linttime;
    int size;
    unsigned long numpoints;
    unsigned long trigger, triggerend;
    int numevents;
    int eventcount=0;

//for debug only
errfd=2;

	size=sizeof(outgoing);

    if(argc < 5){
	    printf("Usage: %s [ Dbaseservice Address ] [ Dbaseservice Port ] [numpoints] [ numevents ] ",argv[0]);
	    exit(1);
    }
    
    /* localhost port to talk to control/dbase program */
    sscanf(argv[2],"%hd",&dbPort);
    sscanf(argv[3],"%ld",&numpoints);
    sscanf(argv[4],"%d",&numevents);
    
    /* init the control/dbase port */
    /* dbase is a TCP, not UDP port */
    setupDBcomms(argv[1],dbPort);
  

    rsecs=secs=time(NULL);
    microsecs=0;
    srand48(time(NULL));
    simpress=5000.0;
	rnum=drand48();
	trigger=numpoints*.3*rnum; //random somewhere in first 3rd of data
	triggerend=trigger+100;
		//printf("Initial Trigger at %ld\n",trigger);
    /* main loop, runs forever */
    for(i=0;i<numpoints;i++){
	    g_err(NOEXIT,NOPERROR,"%ld",i);
	    pacnum=i;
	/* Send received datagram to the control database program */
	rnum=drand48();
	rnum=(2*(rnum-0.5)); //yields -1 to +1
	if(eventcount < numevents){
		if(i==trigger){
			osimpress=simpress;
		}
		else if((i>trigger) && (i<triggerend)){
			if(rnum<0)
				simpress-=(simpress*.1);
			else
				simpress+=(simpress*.1);
		}
		else if(i==triggerend){
			trigger=(((numpoints-i)*drand48()))+i;
			triggerend=trigger+100;
			//printf("Trigger at %ld\n",trigger);
			simpress=osimpress;
			eventcount++;
		}
		else{
			rnum*=.0002; 
			simpress = simpress * (1+rnum);
		}
	}
	else{
		rnum*=.0002; 
		simpress = simpress * (1+rnum);
	}

	printf("%ld,%f\n",i,simpress);
	if(simpress < 1)
		simpress=1;

	microsecs+=100000;
	if(microsecs >= 1000000){
		microsecs=0;
		secs++;
	}
	memset(outgoing,PADCHAR,size);
	if((n=snprintf(outgoing,size,
		"{ \"type\":\"%c\","
		  "\"id\":\"%s\","
		  "\"pressure\":%.1f,"
		  "\"fills\":%d,"
		  "\"temperature\":%d,"
		  "\"humidity\":%d,"
		  "\"time\":%lu.%06lu,"
		  "\"pad\":\"",
		'D',
		"SIMULATOR",
		simpress,
		1,
		22,
		70,
		secs,
		microsecs
	)) >= size)
		g_err(EXIT,PERROR,"OUTPUT TRUNCATION! %d",n);
	else
		outgoing[n]=PADCHAR;//get rid of null term in json
			
	outgoing[DBPACKETSIZE-2]='"';
	outgoing[DBPACKETSIZE-1]='}';

	sendToDB(outgoing);
    }//end for

    rsecs = time(NULL)-rsecs;
    g_err(NOEXIT,NOPERROR,"Time to run: %ld secs %f transactions/sec\n",(unsigned long)rsecs,(float)((float)numpoints/(float)rsecs));
    fflush(stderr);
    fflush(stdout);
    g_err(NOEXIT,NOPERROR,"Waiting for output to drain");

}  //end main

int dbsock=-1;
struct sockaddr_in ClntAddr;

bool connected=false;

bool doconnect(void );


extern struct sockaddr_in controlDBIp;
extern char deviceID[];


void
setupDBcomms(
	unsigned char *ipaddr,		  //ip address to connect to
	unsigned short port		  //port to listen on
	)
{

	int clntSock;
	int tsize;

	struct tm *filetime;
	char backbuf[128];
	time_t myloctime;
 

	tsize=sizeof(struct sockaddr_in);
	/* Construct local address structure */
	/* Zero out structure */
	memset(&controlDBIp, 0, sizeof(controlDBIp));        

	/* Internet address family */
	controlDBIp.sin_family = AF_INET;             	 

	/* Any incoming interface (in case of multiple */
	/*  network cards like wireless and ether) */
	controlDBIp.sin_addr.s_addr = inet_addr(ipaddr); 

	/* Local port  for control/dbase */
	controlDBIp.sin_port = htons(port);      

	doconnect();

}

/* called from setup and from main loop to reconnect 
 * dead dbase
 */
bool
doconnect(void)
{

	int status;
	int myflags;
	struct timeval timeout;
	bool firstime=true;

       /* Establish the connection to the dbase server 
	* asynchronously.
	* a connect can take up to 4 minutes to timeout
	* using the system wide constant so lets not hang for that long
	*/


	g_err(NOEXIT,NOPERROR,"%s:SOCKET DB attempting connect",__FUNCTION__);

	/* Create socket for sending/receiving datagrams */
	if ((dbsock = socket(PF_INET, SOCK_STREAM , IPPROTO_TCP)) < 0){
		g_err(EXIT,PERROR,
		"%s: socket() call failed on db socket",__FUNCTION__);
	}

	else if((myflags=fcntl(dbsock,F_GETFL,0))<0){
		g_err(NOEXIT,PERROR,"Could not get dbsock flags");
	}

	/* set the socket to non blocking so we don't get
	   hung up if server unavailable */

	else if(fcntl(dbsock,F_SETFL,myflags|O_NONBLOCK) < 0)
		g_err(NOEXIT,PERROR,"Could not set dbsock to non blocking");

        else if((status=connect(dbsock,
		(struct sockaddr *)&controlDBIp,
		sizeof(controlDBIp))) < 0){

		if( (errno == EINPROGRESS) || (errno == EALREADY) )
			g_err(NOEXIT,NOPERROR,"%s: in progress",__FUNCTION__);
		else if (errno == EISCONN){
			g_err(NOEXIT,PERROR,"%s: already connected",__FUNCTION__);
			connected=true;
			return(true);
		}
		else
			g_err(EXIT,PERROR,"%s: failed %d",__FUNCTION__,errno);
	}

	/* connect succeeded immediately */
	else if(status == 0){
	    	g_err(NOEXIT,NOPERROR,"%s: connected",__FUNCTION__);
		/* go back to blocking mode */
		if(fcntl(dbsock,F_SETFL,myflags) < 0)
			g_err(NOEXIT,PERROR,"Could not set dbsock to blocking");
		connected=true;
		return(true);
	}
	else{
	    	g_err(NOEXIT,NOPERROR,"%s: no news",__FUNCTION__);
	}
		

	return(false);
}



/* write a message to the dbase pipe.
 * if its not connected, reconnect it
 * if it won't reconnect or there are other errors
 * store the data in the backup file in /tmp/backup_port#_date
 */

bool
sendToDB(char *message)
{

	int bytesSent;

	int totalbytes=0;
	//g_err(NOEXIT,NOPERROR,"#%d SEND: %.200s\n",pacnum,message);

while(totalbytes != DBPACKETSIZE){
	if((bytesSent=send(dbsock,
		message+totalbytes,
		DBPACKETSIZE-totalbytes,
		MSG_NOSIGNAL))<0) {

			if( (errno == ENOTCONN) || 
			    (errno == EPIPE)    || 
			    (errno == ECONNRESET) ||
			    (errno == ECONNREFUSED) ){
				g_err(EXIT,PERROR,
				"%s: socket not connected",__FUNCTION__);
			}
			else if( errno == EAGAIN || errno==EWOULDBLOCK){
				struct timeval tv;
				fd_set wfds;
				int retval;
				g_err(NOEXIT,NOPERROR,
					"Pac #%ld: Dbase Wait",pacnum);
				FD_ZERO(&wfds);
				FD_SET(dbsock,&wfds);
				tv.tv_sec = 5;
				tv.tv_usec = 0;
				retval=select(dbsock+1,NULL,&wfds,NULL,&tv);
				switch(retval){
				    case -1:
					g_err(EXIT,PERROR,"select() failed");
				    case 0:
					g_err(NOEXIT,NOPERROR,
					"\nWARNING: Timeout waiting on"
				       	"dbase try again\n");
					break;
				    default:
					g_err(NOEXIT,NOPERROR,
					"Dbase caught up");
					break;
				}
				continue;
			}
			else{
				g_err(EXIT,PERROR,
				"#%d: Critical Error on Send",pacnum);
			}
	}//end if send < 0
	else if(bytesSent == 0){
		g_err(EXIT,PERROR,"%s: Disconnected from dbase socket",__FUNCTION__); 
	}//end ==0

	totalbytes+=bytesSent;

	if(totalbytes<DBPACKETSIZE){
		g_err(NOEXIT,NOPERROR,"partial packet write on pac #%ld, try to finish",pacnum);
		g_err(NOEXIT,NOPERROR,"first seg: %.*s",bytesSent,message);
		g_err(NOEXIT,NOPERROR,"totalbytes: %d next seg: %.*s",totalbytes,DBPACKETSIZE-totalbytes,message+totalbytes);
	}


}

}



