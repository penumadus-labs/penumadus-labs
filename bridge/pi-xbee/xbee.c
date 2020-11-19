
/* the main xbee interface,  this should be a c++ class probably */
#include <unistd.h>     /* for close() */
#include <stdarg.h>     /* for close() */
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
#include <sys/select.h>
#include <termios.h>
#include <utils.h>
#include <bool.h>
#include <netcomms.h>
#include <xbee.h>
#include <xbeeintfc.h>
#include <trans.h>
#include <sync.h>

int packetstotal=0;;
int acks=0;
int packetpending=0;

void delay(int ms) { usleep(ms*1000); }
char *readUntilCR(void);
bool initcomms(char *serialport, unsigned short port, bool reset);
void *processUpBound(void *);		//upbound from xbee processing thread
void * getstatusthread(void *arg);	//thread to poll modem status
void processframe(unsigned char *frame);
void checkReceivedFrames(unsigned char *frameptr);
unsigned char nextChar(int len);
int gatherframe(unsigned char *frame);
bool checkchar(unsigned char *frame);

int s_fd;  //file descriptor for serial port
bool cell_avail=false;
int cell_DB=0;
int cell_AI=0;
int cell_TP=0;
bool statDBwait=false;

/* routine to get into command mode */
void
cmndmode(){


	//have to delay one second or greater, write +++, and idle 1 second or greater
	//to enter command mode
	delay(1010);
	write(s_fd,"+++",3);
	readUntilCR();
	delay(1010);
	g_err(NOEXIT,NOPERROR,"switch to API mode");
	write(s_fd,"ATAP2\r",6); 
	readUntilCR();
	g_err(NOEXIT,NOPERROR,"close command mode");
	write(s_fd,"ATCN\r",5); 
	readUntilCR();
	sleep(1);
	tcflush(s_fd,TCIFLUSH);

	//now should be in API mode 2 with nothing in queue
}

/* build an AT string for use in apimode */
void
atcmnd(char *cmnd, int nargs, ...){

	unsigned char frame[MAXFRAMEBUF];
	unsigned char locbuf[FRAMESIZE];
	int size;
	
	/* get the variadic user string */
	va_list ap;
	va_start(ap, nargs);

	size=0;
	locbuf[size++]=CELLSTATID;
	while(*cmnd != '\0')
		locbuf[size++]=*cmnd++;
	
	while(nargs-- > 0)
		locbuf[size++]= (char) va_arg(ap, int);

	locbuf[size]=0;

	va_end(ap);

	makeApiFrame(ATCMND,locbuf,size,frame);
	sendApiFrame(frame,s_fd);
}


bool
initcomms(char *serialport, unsigned short udpport, bool reset)
{

	char ipaddr[256];
	char db[256];
	char sq[256];
	int ai;
	int i;
	unsigned char *frameptr;
	char frame[MAXFRAMEBUF];
	char initbuf[MAXFRAMEBUF];

	newCondVar(&sendUDP_cond);
	newMutex(&udplock);
	newMutex(&apilock);

	/* might as well reset,  anything looks like it causes one anyway */
	/* reset modem */
	if(reset){
		modemreset(false);
		delay(300);
	}


	//Initialize serial port
	if( (s_fd=portsetup(serialport)) < 0){
		g_err(EXIT,NOPERROR,"Could not Init Port: %s\n",serialport);
	}
	g_err(NOEXIT,NOPERROR,"Xbee fd: %d  Errfd: %d\n",s_fd,errfd);



	cmndmode();

	/* start xbee read thread for protocol traffic */
	{
		pthread_t readthread;
		if(pthread_create(&readthread,NULL,&processUpBound,NULL) != 0){
			g_err(EXIT,PERROR,"Could not create reader thread");
		}
	}

	/* start xbee status thread to poll cell status */
	{
		pthread_t getstatus;
		if(pthread_create(&getstatus,NULL,&getstatusthread,NULL) != 0){
			g_err(EXIT,PERROR,"Could not create status thread");
		}
	}


	/* NOTE use automatic socket (API mode with implicit sockets) 
	 * controlled by C0 since only using one destination
	 * and this will cut down on serial traffic as xbee handles socket open/close/bind
         * and timeout errors.  also makes code more compatible to single threaded arduino
	 * environment.
         */

	/* set default listen port */
	g_err(NOEXIT,NOPERROR,"set default listen port as port %d = 0x%lx 0x%lx",
		udpport,
		(unsigned char)((udpport>>8)&0xFF),
		(unsigned char)(udpport&0xFF) );

	atcmnd("C0",2,
		(unsigned char)((udpport>>8)&0xFF),
		(unsigned char)(udpport&0xFF) );

	/* automatic socket timeout */
	g_err(NOEXIT,NOPERROR,"set timeout to 5 minutes ");
	atcmnd("TM",2, 0x0B, 0xB8);

	/* set UDP mode */
	g_err(NOEXIT,NOPERROR,"set to UDP mode");
	atcmnd("IP",1,0);

	/* turn off remote manager */
	g_err(NOEXIT,NOPERROR,"disable remote manager");
	atcmnd("DO",1,0);

	/* turn on cell status light */
	g_err(NOEXIT,NOPERROR,"turn on cell status light");
	atcmnd("D5",1,1);

	/* print IP addr */
	atcmnd("MY",0);


#ifdef IPADDRCHECK
	while(true){
		/* print my IP address */
		g_err(NOEXIT,NOPERROR,"print my ip address");
		write(s_fd,"ATMY\r",5);
		strcpy(ipaddr,readUntilCR());
		if(strncmp(ipaddr,"0.0.0.0",7) != 0){
			break;
		}
		else
			sleep(2);
	}
	

	/* print DNS address */
	g_err(NOEXIT,NOPERROR,"print DNS1 address");
	write(s_fd,"ATN1\r",5);
	readUntilCR();

	/* print DNS address */
	g_err(NOEXIT,NOPERROR,"print DNS2 address");
	write(s_fd,"ATN2\r",5);
	readUntilCR();
	

	g_err(NOEXIT,NOPERROR,"write it all");
	write(s_fd,"ATWR\r",5);
	readUntilCR();
	delay(3000);

#endif
} 


/* init helper routine for operating in transparent mode */
char *
readUntilCR(void)
{

	/* this needs a timeout using select if there is no data incoming */
	static char buf[BIGBUF];
	char *bptr;
	int i;

	bptr=buf;

	*bptr=='\0';
	i=0;

	read(s_fd,bptr,1);
	while(*bptr != '\r'){

		/* no CR and buffer overrun */
		if(i >= BIGBUF)
			return(NULL);

		write(errfd,bptr,1);
		i++;
		bptr++;

		/* this is a blocking read */
		read(s_fd,bptr,1);
	}
	
	*(++bptr)='\0';
	write(errfd,"\r\n",2);
	return(buf);
}


/*********************incoming thread for xbee to pi ************/

void *
processUpBound(void *arg)
{

	int n;
	unsigned char lchar;
	unsigned char frame[MAXFRAMEBUF];

	g_err(NOEXIT,NOPERROR,"Begin main upbound processing loop");
	
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
				checkReceivedFrames(frame);
			}
		}
		else
			printf("Strange char %c\n",lchar);
	}
}


int
gatherframe(unsigned char *frame){
	int  len;
	unsigned char lenlo, lenhi;
	int checksum;
	int ret;
	int i;
	unsigned char *tptr;
	
	tptr=frame;

	/* just got a 0x7E, so get the length character */
	*tptr++=0x7E;
	
	/* read the two length bytes */

	/* get char from somewhere(buf or read), 
	 * and don't wait on more */
	*tptr=nextChar(1);
	if( !checkchar(tptr) )
		return(RESTART);
	tptr++;


	*tptr=nextChar(1);
	if( !checkchar(tptr) )
		return(RESTART);
	tptr++;

	len=(frame[1]<<8)|frame[2];

	/* read/buffer the rest of the frame, nextChar only returns one character 
           but big len causes the buffer to be filled without blocking cause
           we know at least len bytes are available.  the checkchar routine
           takes care of buffer destuffing and frame restarts 
	   may do some single char reads depending on how many 7Ds
        */
	*tptr=nextChar(len);
	if( !checkchar(tptr) )
		return(RESTART);
	checksum=*tptr;
	tptr++;

	/* +1 to include the checksum at end of frame */
	for(i=1;i<len+1;i++){
		*tptr=nextChar(1);
		if( !checkchar(tptr) )
			return(RESTART);
		checksum+=*tptr;
		tptr++;
	}

#ifdef FULL_DEBUG
	fprintf(stderr,"\nxbee->PI %s:-------------------\n",__FUNCTION__);
	printApiFrame(frame);
	fprintf(stderr,"final len: %d\n",len+3);
#endif
	if((checksum & 0xFF) != 0xFF){
		g_err(NOEXIT,NOPERROR,"Bad Checksum: 0x%02x",checksum);
		return(BADCHECKSUM);
	}
	

	/*return total length of frame with 0x7E, len, data, checksum */
	return(len+3);
}

bool
checkchar(unsigned char *frame){
	/* check the bytes don't contain restarts */
	if(*frame==0x7E){
		g_err(NOEXIT,NOPERROR,"Frame Restart");
		return(false);
	}
	/* check for byte stuffing */
	else if (*frame == 0x7D){
		*frame=nextChar(1);
		//check for a frame restart in a stuff
		if(*frame==0x7E)
			return(false);
		else
			*frame = *frame^0x20;
	}

	return(true);
}


//received data frame from xbee cell net,  process it
void
processframe(unsigned char *frame){

	unsigned char buf[128];
	unsigned short lport;
	unsigned char locframe[MAXFRAMEBUF];
	int len;

	len=(frame[1]<<8)|frame[2];
	fprintf(stderr,"Processing Frame: [%.*s]\n",len-10,frame+13);
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

			
/* all received frames will eventually end up here 
* check their framid's to see what to do with them
* except for AT frame,  check its and AT resp for that one 
*/
void
checkReceivedFrames(unsigned char *frameptr)
{

	unsigned char *msg;

	switch(frameptr[FRAMETYPE]){
		char tcmnd[4];
		case ATCMNDRESP:
			strncpy(tcmnd,frameptr+5,2);
			switch(frameptr[7]){
				case 1:
					printf("AT%s Error on AT Cmnd\n",tcmnd);
					printf("%s\n",tcmnd);
				case 2:
					printf("AT%s Invalid AT Command\n",tcmnd);
					return;
				case 3:
					printf("AT%s Invalid AT Parameter\n",tcmnd);
					return;;
				case 0:
				default:
					//printf("AT%s Success\n",tcmnd);
					
				break;
			}


			/* DB command */
			if(strncmp(frameptr+5,"DB",2)==0){
				cell_DB=frameptr[8];
				printf("Cell Strength: %ddBm\n",cell_DB);
				statDBwait=false;
			}
			else if(strncmp(frameptr+5,"TP",2)==0){
				cell_TP=frameptr[9];
			}
			/* AI command */
			else if(strncmp(frameptr+5,"AI",2)==0){
			    switch(frameptr[8]){
				case 0x00:
					printf("connected/active\n");
					cell_avail=true;
					break;
				case 0x22:
					printf("registering\n");
					cell_avail=false;
					break;
				case 0x23:
					printf("connecting\n");
					cell_avail=false;
					break;
				case 0x25:
					printf("denied\n");
					cell_avail=false;
					break;
				case 0x2d:
					printf("modem shutdown\n");
					cell_avail=false;
					break;
				case 0xff:
					printf("Cell is initializing\n");
					cell_avail=false;
					break;
				default:
					printf("Invalid Status\n");
			     }
			     cell_AI=frameptr[8];
						
			}
			else{
				printf("ATCMND %s return success\n",tcmnd);
			}
			break;

		case MODEMSTATUS:
			printf("MODEM Status\n");
			switch(frameptr[4]){
				case 0:
					printf("Hardware reset or power up\n");
					cell_avail=false; 
					break;
				case 1:
					printf("Watchdog timer reset\n");break;
				case 2:
					printf("Registered with cellular network\n");
					cell_avail=true;
					break;
				case 3:
					printf("Unregistered with cellular network\n");
					cell_avail=false;
					break;
				case 0x0E:
					printf("Rmt Mgr conn\n");break;
				case 0x0F:
					printf("Rmt Mgr disc\n");break;
				case 0x35:
					printf("Cell update started \n");break;
				case 0x36:
					printf("Cell update failed \n");break;
				case 0x37:
					printf("Cell update completed \n");break;
				case 0x38:
					printf("XBee fw update started\n");break;
				case 0x39:
					printf("XBee fw update failed\n");break;
				case 0x3A:
					printf("XBee fw update applying\n");break;
				default:
					printf("Invalid Status\n");
				}
			break;


		case APITXREQRESP:
			fprintf(stderr,"TX response\n");

			/* its an APITXREQRESP from UDP or UDPSneaky, process it */
			/* difference is sendUDP is waited on and timed,  UDPSneaky is not */
			/* and can have many outstanding */
			switch(frameptr[FRAMEID+1]){
				//any interface can return success
				case 0x0: 
					printf("Succesful Transmit\n");
					break;

				//these codes are reserved for xbee by spec
				case 0x21: 
					printf("Fail xmit to cell network\n");
					cell_avail=false;
					break;
				case 0x22: 
					printf("Not registered to net\n");
					cell_avail=false;
					break;
				case 0x2c: 
					printf("Invalid frame values\n");
					break;
				case 0x31: 
					//this has to be bad
					printf("Internal error\n");
					break;
				case 0x32: 
					//out of sockets,  big problem
					printf("Resource error\n");
					break;
				case 0x74: 
					printf("Message too long\n");
					break;
				case 0x76: 
					printf("Socket closed,surprise!\n");
					break;
				case 0x78: 
					printf("Invalid UDP port\n");
					break;
				case 0x79: 
					printf("Invalid TCP port\n");
					break;
				case 0x7A: 
					printf("Invalid host address\n");
					break;
				case 0x7B: 
					printf("Invalid data mode\n");
					break;
				case 0x7C: 
					printf("Invalid interface\n");
					break;
				case 0x7D: 
					printf("Interface relay err\n");
					break;
				case 0x80: 
					printf("Connect refused\n");
					break;
				case 0x81: 
					printf("Socket connection lost\n");
					break;
				case 0x82: 
					printf("No server\n");
					break;
				case 0x83: 
					printf("Socket closed\n");
					break;
				case 0x84: 
					printf("Unknown server\n");
					break;
				case 0x85: 
					//this isn't good either
					printf("Unknown error\n");
					g_err(NOEXIT,NOPERROR,"Unknown modem error\n");
					break;
				case 0x86: 
					printf("Invalid TLS\n");
					break;

				default:
					printf("Invalid Status\n");
			}

			/* is upper nibble equal to cellstat ids */
			if((frameptr[FRAMEID])==packetpending){
				packetpending=0;
				sendUDP_cond.data=0;
				sendUDP_cond.statcode=frameptr[FRAMEID+1];
				acks++;
				kickstatus(&sendUDP_cond);
			}
			else if((frameptr[FRAMEID]&0xF0)==SNEAKYFRAME){
				printf("Sneaky Frame\n");
			}
			else{
				printf("UNSOLICITIED TX RESP: frame 0x\n");
				printf("0x%02x\n",frameptr[FRAMEID]);
				return;	//don't process garbage TXREQRESP
			}
			printf("Stats:%d/%d\n",acks,packetstotal);
			break;

		/* this is a 0xB0 frame from XBEE or WIFI 
			as defined in xbee spec
			only thing incoming should be from UDPengine
                        which means check the first character for an
                        an instruction code  and do it*/

		case RECVDATA:
			g_err(NOEXIT,NOPERROR,"Incoming off socket msg\n");
			processframe(frameptr);
			break;

		default:
			printf("random status traffic\n");
	}
}



/* thread to poll modem status */
void *
getstatusthread(void *arg)
{
		char initbuf[32];
		char frame[MAXFRAMEBUF];
		int counter=5;
		while(true){
			atcmnd("AI",0);
			if(cell_avail){
				if(!statDBwait){
					atcmnd("DB",0);
					statDBwait=true;
				}
			}
			if(counter++ > 5){
				atcmnd("TP",0);
				counter=0;
			}
			sleep(RECOVERYINTERVAL);
		}
}


/****************** outbound to internet from pi to xbee to internt *******/

/* send a UDP frame to server */
/* formerly used fixed FRAMESIZE udp frames for simplicity on both ends */
/* now can be up to FRAMESIZE */
int
sendUDP( char *addr,	
	short port, 
	const char *packetdata, 
	int packetlen)
{

	unsigned char udpPacket[FRAMESIZE];
	unsigned int ip[4];
	int i;
	unsigned char frame[MAXFRAMEBUF];
	int retcode;

	static int framid=0;

	//only one standard sendudp at a time
	//if multithreaded sends,  enforce this with lock
#ifdef MULTISEND
        pthread_mutex_lock(&udplock);
#endif

	g_err(NOEXIT,NOPERROR,"CATM1 HANK->UDP SendUDP: packetlen %d: [ %.*s ]\n",
		packetlen,
		packetlen,
		packetdata);

	memset(udpPacket,0,FRAMESIZE);

	if(framid++ > 9)
		framid=1;

	//arbitrary frame id  FRAMEDATAID is for sending packets
	//these are synced up when xbee acks it has been sent
	packetpending=udpPacket[0]=framid+FRAMEDATAID;

	sscanf(addr,"%d.%d.%d.%d",&ip[0],&ip[1],&ip[2],&ip[3]);
	udpPacket[1]=ip[0];		//ip addr
	udpPacket[2]=ip[1];		//ip addr
	udpPacket[3]=ip[2];		//ip addr
	udpPacket[4]=ip[3];		//ip addr
	udpPacket[5]=((port&0xFF00)>>8);	//dest port
	udpPacket[6]=((port&0x00FF));		//dest port
	udpPacket[7]=0;		//source port
	udpPacket[8]=0;		//source port
	udpPacket[9]=0;		//protocol
	udpPacket[10]=0;		//transmit options
	/* payload */
	for(i=11;i<packetlen+11;i++){
		udpPacket[i] = *packetdata++;
	}
	udpPacket[i++] = '\0';

	//make udp frame into socket send xbee api frame
	makeApiFrame(APITXREQ,udpPacket,i,frame);


	//set flag to false before creating situation to set it true
	//in other thread
	sendUDP_cond.flag=false;

	packetstotal++;

	//send udp encapsulated in api frame
	sendApiFrame(frame,s_fd);

	if(sleep_on_status(&sendUDP_cond,5000) != 0){
		g_err(NOEXIT,PERROR, "%s: error timeout on sleep socket=%d",__FUNCTION__,socket);
		printApiFrame(frame);
		retcode= 256;
	}
	else if(sendUDP_cond.statcode !=0 ){
		g_err(NOEXIT,NOPERROR,"%s, SendUDP err %d ",
			__FUNCTION__,sendUDP_cond.statcode);
		retcode= sendUDP_cond.statcode;
	}
	else
		retcode= 0;

#ifdef MULTISEND
	pthread_mutex_unlock(&udplock);
#endif

    return(retcode);
}

/* send a UDP frame to server but don't wait on it and sequence it */
//PONDSCUM cleanse this to work with sockets
void
sendUDPSneaky(char *addr,short port, const char *packetdata, int packetlen)
{

	unsigned char udpPacket[FRAMESIZE];
	unsigned int ip[4];
	int i;
	unsigned char frame[MAXFRAMEBUF];
	static int framid=0;

	printf("SendUDP: packetlen %d: [ %.*s ]\n",packetlen,packetlen,packetdata);

	if(packetlen > sizeof(udpPacket)-12 ){
		packetlen=sizeof(udpPacket)-12;
		printf("PACKET TRUNCATION\n");
	}


	memset(udpPacket,0,FRAMESIZE);

	if(framid++ > 9)
		framid=1;

	//arbitrary frame id
	udpPacket[0]=framid+SNEAKYFRAME;
	sscanf(addr,"%d.%d.%d.%d",&ip[0],&ip[1],&ip[2],&ip[3]);
	udpPacket[1]=ip[0];		//ip addr
	udpPacket[2]=ip[1];		//ip addr
	udpPacket[3]=ip[2];		//ip addr
	udpPacket[4]=ip[3];		//ip addr
	udpPacket[5]=((port&0xFF00)>>8);	//dest port
	udpPacket[6]=((port&0x00FF));		//dest port
	udpPacket[7]=0;		//source port
	udpPacket[8]=0;		//source port
	udpPacket[9]=0;		//protocol
	udpPacket[10]=0;		//transmit options
	/* payload */
	for(i=11;i<packetlen+11;i++){
		udpPacket[i] = *packetdata++;
	}
	udpPacket[i++] = '\0';

	//make udp frame into api frame
	makeApiFrame(APITXREQ,udpPacket,i,frame);

	//send udp encapsulated in api frame
	sendApiFrame(frame,s_fd);

}
