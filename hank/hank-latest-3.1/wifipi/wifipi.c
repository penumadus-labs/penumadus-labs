
/* turn a pi0 into an xbee emulator for wifi */

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
#include <utils.h>
#include <bool.h>
#include <netcomms.h>
#include <protocol.h>
#include <wifipi.h>

/* notes on WIFI PROCESSING
*1.) WIFI boots and sends a WIFIBOOTED to hank meaning it is up but
        not connected to server or internet
*2.) hank calls check checkwifiavail()
        which sends a command to server via back channel.
        (sendUDPsneaky)
	this informs wifipi of server address 
*3.) wifipi  waits for a response from UDPengine server to query, polls every 
        few seconds
*4.) wifipi sends a WIFIUP to hank once query is successful
*5.) hank wets wifi_avail flag and the sendudp routine uses the serial port
	instead of the serial3 port for sending data
*6.) wifipi can invalidate its connection status at any time if server link
	or wifi fails by sending WIFIDOWN and hank will revert to cell
	a subsequent WIFUP we revalidate.  WIFIBOOTED will only be sent after
        a powerup
*/
void sendbootedstatus();	/* let hank know wifipi is booted */

long messagecnt=0;	//count of incoming messages

extern int portsetup( char *serialport );

int s_fd;		//file descriptor for the serial port
char *serialportname;	//name of the serial port set below
int sock_fd;		//file descriptor for udp socket
extern int errfd;

int bigindex=0; 

void *udp_readthreadproc(void *arg);
bool sendUDP( struct sockaddr_in *RemoteIP, char *msg, int len);
void processUpBound(char *rem_addr, char *rem_port);
int udpsetup( unsigned short listenport);
unsigned char *makeApiFrame(unsigned char frameType, 
			    unsigned char *data,
			    short datalen,
			    unsigned char *frame);
void sendApiFrame(unsigned char *frame);

void sendWifiUnavail(void);



extern int gatherframe(unsigned char *frame);
void processframe(unsigned char *frame, int len);
extern void printApiFrame(unsigned char *frame);
unsigned char nextChar(int len);
struct sockaddr_in RemoteIP;		/* address of amazon */
bool remoteipinit=false;		/* valid address for server recvd from hank */
bool querysent=false;			/* toggles when waiting for a wifi up/down verify */

int 
main(int argc, char *argv[])
{


	/* for debug only */
	errfd=2;

	g_err(NOEXIT,NOPERROR,"Initializing...\n");

	if(argc < 2){
		char *usestring="Usage: %s [ SerialPort ]";
		fprintf(stderr,usestring,argv[0]);
		g_err(EXIT,NOPERROR,usestring,argv[0]);
	}



	//Initialize serial port
	serialportname=argv[1];
	if( (s_fd=portsetup(argv[1])) < 0){
		g_err(EXIT,NOPERROR,"Could not Init Port: %s",argv[2]);
	}


	/* let hank know we are ready to process commands */
	sendbootedstatus();
	
	/* start reading the serial and sending to udp as speced in serial packet */
	processUpBound(argv[1], argv[2]);
}


void
initnetworkstuff(void)
{
	pthread_t udp_readthread;	     /* thread to serial from UDP*/
	char *cptr;
	unsigned short port;

	cptr=inet_ntoa(RemoteIP.sin_addr);
	port = ntohs(RemoteIP.sin_port);

	g_err(NOEXIT,NOPERROR,
	  "Initializing network: Server addr: [ %s:%hd ]",cptr,port);

	while( (sock_fd=udpsetup(port)) < 0 ){
		g_err(NOEXIT,PERROR,"Could not Init UDP");
		sleep(10);
	}

	fprintf(stderr,"Sock_fd is %d\n",sock_fd);

	/* start the down thread */
	if(pthread_create(&udp_readthread,NULL,udp_readthreadproc,NULL) != 0){
		g_err(EXIT,PERROR,"%s Failed to start udp_readthreadproc",__FUNCTION__);
	}
}

/* make an xbee UDP RECV 0xB0 code compatible 
   packet out of a std UDP packet */
int
parseB0packet(unsigned char *xbeeframebuf,
		struct sockaddr_in *incomingAddr,
		unsigned char *incomingBuf,
		int recvMsgSize)
{

	unsigned long ipaddr;
	unsigned short port;
	int i;

	//fill in address bytes of xbee 0xB0 frame

	ipaddr=ntohl(incomingAddr->sin_addr.s_addr);
	for(i=3;i>=0;i--){
		xbeeframebuf[i]=(unsigned char)(ipaddr&0xFF);
		ipaddr=ipaddr>>8;
	}

	//recvport
	ipaddr=ntohs(incomingAddr->sin_port);
	xbeeframebuf[5]=(unsigned char)(ipaddr&0xFF);
	ipaddr=ipaddr>>8;
	xbeeframebuf[4]=(unsigned char)(ipaddr&0xFF);

	//src port, who cares
	xbeeframebuf[6]=xbeeframebuf[7]=0;

	//0=UDP
	xbeeframebuf[8]==0;

	//resvd
	xbeeframebuf[9]==0;

	strncpy(xbeeframebuf+10,incomingBuf,recvMsgSize);

	//PONDSCUM add later to shutdown wifipi also 
	/*
	if(*incomingBuf == SHUTDOWN){
		startproc("/sbin/shutdown",2,"1","min");
	}
	*/

	return(recvMsgSize+10);
}

/* thread to read udp and pass to serial port */
void *
udp_readthreadproc(void *arg){

	struct sockaddr_in incomingAddr; /* Client address */
	unsigned int incomingAddrLen;         /* Length of incoming message */
	int recvMsgSize;
	char incomingBuf[MAXUDP];
	static long messagecnt=0;;
	unsigned char frame[MAXFRAMEBUF];
	unsigned char buf[32];

	g_err(NOEXIT,NOPERROR,"UDP readthread started\n");
	while(true){
		/* receive incoming message */
		incomingAddrLen = sizeof(incomingAddr);
		if ((recvMsgSize = recvfrom(sock_fd, incomingBuf, MAXUDP, 0,
		    (struct sockaddr *) &incomingAddr, &incomingAddrLen)) < 0){
			g_err(EXIT,PERROR,"Could Recv From Socket");
		}

		incomingBuf[recvMsgSize]='\0';
		messagecnt++;
		
		g_err(NOEXIT,NOPERROR,
			"UDP->WIFIPI: client %s Msg# %ld Len: %d\n",
			inet_ntoa(incomingAddr.sin_addr),
			messagecnt,
			recvMsgSize);

		/* is this a message to wifipi, not hank */
		/* there are very few of these */

		//if recv msg is link check, 
		//send status report to hank
		//to let him know we are up.
		if(strncmp(incomingBuf,
			    WIFIQUERYRESP,
			    sizeof(WIFIQUERYRESP)-1)==0) {

			querysent=false;
			buf[0]=WIFIAVAIL;
				
			makeApiFrame(WIFICMND,buf,1,frame);
			sendApiFrame(frame);
			g_err(NOEXIT,NOPERROR,"WIFIPI->HANK:1: Send AVAIL");
		}


		//not for wifipi,  just send message on to hank
		else {
			unsigned char xbeeframebuf[MAXFRAMEBUF];
			int newsize;
			g_err(NOEXIT,NOPERROR,
			    "UDP->HANK:%d: [ %s ]",recvMsgSize,incomingBuf);

			newsize=parseB0packet(xbeeframebuf,&incomingAddr,
				incomingBuf,recvMsgSize);
			makeApiFrame(RECVDATA,xbeeframebuf,newsize,frame);
			sendApiFrame(frame);
		}//end if for hank
	}//end while true
}//end udpreadthread


int
udpsetup(unsigned short listenport){

    struct sockaddr_in localAddr; /* Local setup to listen */
    int sock_fd;
    unsigned short localPort;			/* local src port */

    localPort=listenport;

    /* Create socket for sending/receiving datagrams */
    if ( (sock_fd = socket(PF_INET, SOCK_DGRAM , IPPROTO_UDP)) < 0){
        g_err(NOEXIT,PERROR,"UDPengine: socket() call failed");
	return(-1);
    }

    /* Construct local address structure */
    memset(&localAddr, 0, sizeof(localAddr));  /* Zero out structure */
    localAddr.sin_family = AF_INET;             /* Internet address family */
    localAddr.sin_addr.s_addr = htonl(INADDR_ANY); /*Any incoming interface*/
    localAddr.sin_port = htons(localPort);      /* Local port */

    /* Bind to the local address */
    if (bind(sock_fd, (struct sockaddr *) &localAddr, sizeof(localAddr)) < 0){
        g_err(NOEXIT,PERROR,"%s UDPengine: bind() call failed",__FUNCTION__);
	return(-1);
    }
    else
	return(sock_fd);
}



/* thread has two functions:
 * 1. It sends a packet to hank to let him know wifipi is alive
 * 2. Hank in return sends a query to server to find out if its alive
 * 3. This upbound packet lets us extract the server address stored on hanks
 *    SD card
 * 4. A return from the server that it is up generates a WIFIAVAIL to hank to
 *    let him know we are all ready to pass traffic
 * 5. This process continues to send WIFQUERYSTRINGS to the server, without hank's
 *    involvement, to keep the routers holding our path open since 
 *    this is UDP not TCP (see RFC, spec is 90 seconds) and to
 * 6. inform the server and DBASE that we are still here and active
 */


void *
udp_holdConnection(void *arg){
	char *bufptr=WIFIQUERYSTRING;
	g_err(NOEXIT,NOPERROR,"hold connect thread started\n");
	while (true){
		if(remoteipinit){
			/* should have WIFIQUERY by now,  else wifi is down */
			if(querysent){
				/* this only occurs if sendUDP passes meaning wifi is connected */
				g_err(NOEXIT,NOPERROR,"Wifi Down due to query delay");
				sendWifiUnavail();
			}
			else if(sendUDP(&RemoteIP, bufptr, strlen(bufptr))){
				g_err(NOEXIT,NOPERROR,"WIFIPI->UDP sent link hold");
				querysent=true;
			}
			else{
				g_err(NOEXIT,NOPERROR,"Wifi Down failed sendUDP");
				sendWifiUnavail();
			}
		}
		/* no remote ip init,  force hank to send one */
		else{
			sendbootedstatus();
		}
		sleep(LINKCHECKINTERVAL);
	}
}

void
processUpBound(char *rem_addr, char *rem_port)
{

	pthread_t udp_holdConnectionThread;	     /* thread to keep udp routers open */
	char msgbuf[2*MAXUDP];

	int n;
	unsigned char lchar;
	unsigned char frame[MAXFRAMEBUF];

	
	/* start the connect hold  */
	/* this thread doesn't use network until inited,  just tickles hank */
	/* to send a WIFIQUERY packet to get everything started */
	if( pthread_create(&udp_holdConnectionThread,
		NULL, udp_holdConnection, NULL) != 0)
	{
		g_err(EXIT,PERROR,"%s Failed to start udp_readthreadproc",
				__FUNCTION__);
	}

	g_err(NOEXIT,NOPERROR,"Processing Upbound traffic\n");

	/* begin main upbound processing loop */
	while(true){

		lchar=nextChar(0);
		/* write chars to outbuf unless a frame start of 0x7E */
		if(lchar==0x7E){
			//use while to handle frame restarts
			while( (n=gatherframe(frame)) == RESTART){
				g_err(NOEXIT,NOPERROR,"**Frame Restart\n");
			}

			if(n==BADCHECKSUM)
				fprintf(stderr,"frame chksum err %d\n",n);
			else{
				processframe(frame,n);
			}
		}
		else{
			if( lchar == 0x0d ){
				putc('\n',stdout);
				fflush(stdout);
			}
			else if ( lchar != 0x0a )
				putc(lchar,stdout);
		}
	}
}

bool
sendUDP( struct sockaddr_in *rem_IP, char *msg, int msglen){

	int n;
	int outgoingsize;

	if ( (n=sendto(sock_fd,
		msg,
		msglen,
		0,
		(struct sockaddr *) rem_IP,
		sizeof(struct sockaddr_in))) != msglen) 
	{
		g_err(NOEXIT,NOPERROR,
			"sendto() sent  %d bytes expecing %d\n",n,msglen);
		return(false);
	}

	else{
		//g_err(NOEXIT,NOPERROR,"sendto() sent %d bytes",n);
		return(true);
	}
}


//determine frame type and do appropriate action
void
processframe(unsigned char *frame, int len){

	unsigned char buf[128];
	unsigned short lport;
	unsigned char locframe[MAXFRAMEBUF];

	switch(frame[FRAMETYPE]){

	    /* normal way to go,  xmit a frame */
	    case APITXREQ:

		sprintf(buf,"%d.%d.%d.%d",
			frame[FRAMETYPE+2],
			frame[FRAMETYPE+3],
			frame[FRAMETYPE+4],
			frame[FRAMETYPE+5]
		);
		lport=(frame[FRAMETYPE+6]<<8)&0xFF00;
		lport=lport|(frame[FRAMETYPE+7]&0x00FF);

		/* Zero out structure */
		memset(&RemoteIP, 0, sizeof(RemoteIP));        

		/* set up address and port */
		RemoteIP.sin_family=AF_INET;
		inet_aton(buf, &RemoteIP.sin_addr);
		RemoteIP.sin_port = htons(lport);

		g_err(NOEXIT,NOPERROR,
			"Hank->UDP: send request host: %s:%d",
			buf,
			(unsigned int)lport);

		/* IMPORTANT:  the first transmit from HANK tells us */
		/* what port and ip address we should talk to so we */
		/* get our parameters from his SD card */
		if(!remoteipinit){
			initnetworkstuff();
			remoteipinit=true;
		}

		if( sendUDP(&RemoteIP, frame+FRAMETYPE+12, len-(FRAMETYPE+12)-1) ){
			//successful transmit, defined as 0 same as for xbee
			buf[1]=WIFI_SUCCESS;	
		}
		else{
			//custom defined code to indicate wifi failure
			//this will set wifi_avail = false in hank
			//since a sendUDP should only fail if link is down
			//the udpholdconnect check will bring it back up if it reappears
			buf[1]=WIFI_RET_ERR;  
		}
		buf[0]= frame[FRAMETYPE+1]; //hank waiting on this frame#
		makeApiFrame(APITXREQRESP,buf,2,locframe);
		sendApiFrame(locframe);
		break;

	    default:
		g_err(NOEXIT,NOPERROR,"Unknown frame type 0x%02x",frame[FRAMETYPE]);
	    };
}


/* nextChar routine:
   0 means next available in buffer, wait for CHARBURST if none avail 
   should be ok as packets padded to 128 save short ones 
   which may see a 100mS timer wait in termios setup 

   stuffing byte 0x7D is removed if inframe as chars are asked for
   so don't remove 7D's from regular traffic
*/

unsigned char qbuf[64*1024*1024];

unsigned char
nextChar(int len){

	/* circular queue which autowraps when short rolls over as index */
	static unsigned short unload = 0;
	static unsigned short load = 0;
	int n,i;
	unsigned char readbuf[MAXFRAMEBUF];

	/* special case for not gathering a frame or idle link 
	 * read arbitrary if any chars in buffer, return them one at a time
	 * else read and block. returns after CHARBURST, 128 (VMIN), or 
	 * 1 char + 100mS (VTIME)  
	 */

	//just browsing, not fetching known len
	if(len == 0){	
		if(unload==load){
			/* might as well zero them on empty 
			   queue to put off queue wrap slow fix */
			unload=load=0;
			len=CHARBURST;
		}
		//if load!=unload, at least one char in buffer
		//so no read necessary
		else
			return(qbuf[unload++]);
	}

	//not enough in queue, gotta read something
	if( (load-unload) < len ){

		/* circular queue wrap, do it the hard slow way  */
		/* happens once every 64K bytes if not zero'ed before then */
		if( (load+len) < load){
			fprintf(stderr,"load %d unload %d\n",load,unload);
			fprintf(stderr,"Queue wrap\n");
			if((n=read(s_fd,readbuf,len)) <= 0){
				g_err(EXIT,PERROR,"Error on wrapped buffer fill read in %s, ret=%d",
					__FUNCTION__,n);
			}
			for(i=0;i<n;i++)
				qbuf[load++]=readbuf[i];
		}
		/* MOST OF TIME - read direct into buffer */
		else{
			if((n=read(s_fd,qbuf+load,len)) <= 0){
				g_err(EXIT,PERROR,"Error on buffer fill read of %d in %s, ret=%d",
					len,__FUNCTION__,n);
			}
			load+=n;
		}
			
	}

	/* no need to check for unload=load as we exit if 
         * the read doesn't block and give us a char.  
         * let the shell script that invoked us find a new port
         * and restart wifipi 
	*/
	if(unload == load){
		g_err(EXIT,NOPERROR, 
		"THIS SHOULD NEVER HAPPEN, INPUT BUFFER SCRAMBLED EGGS");
	}
	else
		return(qbuf[unload++]);
}

			

void
testAddress()
{

	char buf[64];
	unsigned char frame[MAXFRAMEBUF];
	int n;
	n=sprintf(buf,SETIPFMT,
			SETIPPARAMS,
			TEST_SERVER_ADDR,
			TEST_SERVER_PORT
	);
	makeApiFrame(WIFICMND,buf,n,frame);
	sendApiFrame(frame);
	g_err(NOEXIT,NOPERROR,"WIFIPI->HANK: sent ip address change");
}

void
sendbootedstatus()
{
	char buf[4];

	//testAddress(); only needed for local testing

	buf[0]=WIFIBOOTED;
	unsigned char frame[MAXFRAMEBUF];
	makeApiFrame(WIFICMND,buf,1,frame);
	sendApiFrame(frame);
	g_err(NOEXIT,NOPERROR,"WIFIPI->HANK sent booted status");
}


void
sendWifiUnavail(void)
{
	unsigned char frame[MAXFRAMEBUF];
	unsigned char buf[MAXFRAMEBUF];

	querysent=false;
	buf[0]=WIFIDOWN;
	makeApiFrame(WIFICMND,buf,1,frame);
	sendApiFrame(frame);
	g_err(NOEXIT,NOPERROR,"WIFIPI->HANK:1: Send WIFIDOWN");
}
