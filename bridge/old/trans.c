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

extern int errfd;	//used in utils.c to determine error output
int journal_fd;		//journal file to log all messages 

//sockets to use as fifo queues between threads
int receiveSocket;
int transmitSocket;
bool wifi_avail=false;

bool sendtoamazon(unsigned char *msg, int n);
bool wifisetup(unsigned char *addr, unsigned short port);

void processUpBound(char *rem_addr, char *rem_port);
void interrupt_handler(int signum);
void setupRemotes(void);
void setupPeriodic(void);

/* MAIN startup, then become the net sender thead */
int 
main(int argc, char *argv[])
{
	char tmpbuf[BIGBUF]; //random buffer
	int ret;		//used for return codes from sys calls
	int xbeesocket=0xFF;	//socket to talk to cell
	int commsock[2];	//sockets returned to use as fifo queues
	int n;
	int retry;		//if a message doesn't go,  
				//retry it till it goes somewhere or count expires

	//defaults
	unsigned char serport[128]="/dev/ttyS0";	   
	unsigned char destaddr[16]="52.14.30.58";	   
	unsigned short port=32159;


	/* for debug only */
	errfd=1;

	g_err(NOEXIT,NOPERROR,"Initializing...\n");

	if(argc==1){
		    g_err(NOEXIT,NOPERROR,
		    "Using Defaults:\n        Serial Port:%s\n          Server IP:%s\n"
		    "        Server Port:%d\n",	
		    serport,
		    destaddr,
		    port);
	}
	else if(argc < 4){
		g_err(EXIT,NOPERROR,
		    "Usage: %s [ SerialPort ] [Server Address] [Server Port]\n",
		     argv[0]);
	}

	else{
		sscanf(argv[3],"%d",port);
		sscanf(argv[2],"%s",destaddr);
		sscanf(argv[1],"%s",serport);
	}
	

	/* catch signals and cntr-C so can clean up nicely */
        signal (SIGINT, interrupt_handler);
        signal (SIGPIPE, interrupt_handler);

	/* start the journal */
	if((journal_fd=open(JOURNALFILE,O_RDWR|O_APPEND|O_CREAT,0644)) < 0){
		g_err(EXIT,PERROR,"Could not open journal file %s",JOURNALFILE);
	}

	/* initialize the xbee comms */
	initcomms(serport,port,true);

	/* setup wifi comms  */
	wifisetup(destaddr,port);

	/* get a socket for cell modem */
	if( (xbeesocket=xbeeSocket()) < 0){
		g_err(EXIT,NOPERROR,
		    "Error on socket create\n");
	}
	/* bind to port and address */
	if (xbeeBind((unsigned char)(xbeesocket),port) < 0){
		g_err(EXIT,NOPERROR,"Error on bind\n");
	}
	g_err(NOEXIT,NOPERROR,"xbee setup success, Socket is %d\n",xbeesocket);

	/* setup a local socketpair as a FIFO for thread to sender communications */
	if(socketpair(AF_LOCAL,SOCK_STREAM,0,commsock) < 0){
		g_err(EXIT,PERROR,"%s Could not setup comm socket pair\n",__FUNCTION__);
	}
	else{
		transmitSocket=commsock[0];
		receiveSocket=commsock[1];
	}

	/* start the UDP reader threads for rem0 and rem1 for accel and magnetometer */
	setupRemotes();

	/* start the periodic/temp reader thread, this is the main worker thread  */
	setupPeriodic();

	/* this becomes the message sender thread,  up all the time */
	/* all messages travel to socket pair and out through here to cell, wifi, or file */
	/* use a socket queue so no one gathering data goes to sleep unless this thing bottles up */

	retry=0;
	while(true)
	{
		if(retry > MAXRETRY){
			g_err(NOEXIT,NOPERROR,"Max Retries Exceeded: [%.*s]\n",n,tmpbuf);
			retry=0;
		}

		if(retry > 0 ){
			sleep(1);
		}
		else {
			if((n=read(receiveSocket,tmpbuf,sizeof(tmpbuf))) < 0)
				g_err(EXIT,PERROR,"%s: Error on Socket Read\n",__FUNCTION__);

			tmpbuf[n++]='\n';
			tmpbuf[n]='\0';

			if( write(journal_fd,tmpbuf,n) != n){
				g_err(EXIT,PERROR,"Could Not write to journal %s\n",JOURNALFILE);
			}
			
		}

		/* send on wifi if available */
		if(wifi_avail){
			if(!sendtoamazon(tmpbuf,n)){
				retry++;
				g_err(NOEXIT,NOPERROR,"WIFI xmit failure");
				
			}
			else{
				retry=0;
			}
		}

		/* no wifi so try sending on xbee */
		else if(cell_avail){
			ret=sendUDP(xbeesocket, destaddr, port,tmpbuf,n);
			switch(ret){
				case 0:
					g_err(NOEXIT,NOPERROR,"Trans Success On Xmit");
					retry=0;
					break;
				case EDOM:
					g_err(NOEXIT,NOPERROR,"Send data too large\n");
					retry=0;
					break;
				case ENETDOWN:
					g_err(NOEXIT,NOPERROR,"Net Down\n");
					retry++;
					break;
				default:
					g_err(NOEXIT,NOPERROR,"%s:SendUDP: Error Code 0x%02x\n",
						__FUNCTION__,ret);
					retry++;
					break;
					
			}
		}
		else
			retry++;
		
	}

}



/* Interrupt_handler so that CTRL +C can be used to exit the program */
void 
interrupt_handler (int signum) {
	close(s_fd);
	close(journal_fd);
        g_err(EXIT,NOPERROR,"\nSIGNAL!!,  Cleanup Done\n");
}


bool
sendData(unsigned char *data)
{

	if(write(transmitSocket,data,strlen(data)) < 0){
		g_err(NOEXIT,PERROR,"%s: write failed\n",__FUNCTION__);
		return(false);
	}
	else
		return(true);
}
