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
#include <math.h>     /* for close() */
#include <sys/select.h>
#include <bool.h>
#include <utils.h>
#include <netcomms.h>
#include <protocol.h>
#include <servercomms.h>
#include <parse.h>


int dbsock=-1;
int back_fd=0;
struct sockaddr_in ClntAddr;

bool connected=false;

bool doconnect(void );
bool sendHello(void );


extern struct sockaddr_in controlDBIp;
extern char deviceID[];
extern parsetbl_t parsetbl[];

extern bool respBADCMND(unsigned char *,unsigned char *,int ,parsetbl_t *);

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
 
	/* create a backup file so if we lose connection to database data */
	/* is at least archived on the server */
	
	myloctime=time(NULL);
	filetime=localtime(&myloctime);
	
	sprintf(backbuf,"/tmp/backup_%hd_%02d-%02d-%d_%02d:%02d:%02d",
			port,
			filetime->tm_mon+1,
			filetime->tm_mday,
			filetime->tm_year+1900,
			filetime->tm_hour,
			filetime->tm_min,
			filetime->tm_sec);

	if((back_fd=open(backbuf,O_CREAT|O_APPEND|O_WRONLY,0444))<0)
		g_err(EXIT,PERROR,"Could Not Create Backup File %s",backbuf);
	else
		g_err(NOEXIT,NOPERROR,"Created Backup File %s",backbuf);

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

	/* if this is a reconnect not a first connect */
	if(dbsock != -1){

		/* send hello traffic to make sure we 
		 * are really disconnected */
		if(sendHello()){
			return(true);
		}
		/* close old socket and
		 * get on with doing a connect */
		else
			close(dbsock);
	}

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
			g_err(NOEXIT,PERROR,"%s: failed %d",__FUNCTION__,errno);
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
		

	/* on the first time through wait a bit it see if */
	/* we can go ahead an connect ahead of timeouts in main loop */
	if(!connected && firstime){
		firstime=false;
		sleep(2);
		if(sendHello())
			return(true);
	}

	connected=false;
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

	int len;

	len=send(dbsock,message,DBPACKETSIZE,MSG_NOSIGNAL); 

	if(len==DBPACKETSIZE){
		connected=true;
		return(true);
	}

	else if(len == 0){
		g_err(NOEXIT,PERROR,"%s: Disconnected from dbase socket",__FUNCTION__); 
		connected=false;
	}
	else if(len < 0){
		if( (errno == ENOTCONN) || 
		    (errno == EPIPE)    || 
		    (errno == ECONNRESET) ||
		    (errno == ECONNREFUSED) ){
			g_err(NOEXIT,PERROR,"%s: socket not connected",__FUNCTION__);
			connected=false;
		}
		else
			g_err(NOEXIT,PERROR,"%s: failed to send to DB socket",__FUNCTION__);
	}
	else if(len < DBPACKETSIZE){
		g_err(NOEXIT,PERROR,"%s: failed to write full packet",__FUNCTION__);
	}

	if(write(back_fd,message,DBPACKETSIZE)<0)
		g_err(EXIT,PERROR,"GIVE UP, NO BACKUP, NO DBASE");
	
	return(false);
}


/* enter here from either a socket ready to read
 * or from a socket closed, only way to be sure
 * is to try and read and look at error code  */
bool
recvFromDB(void)
{
	int len;
	int tlen;
	unsigned char message[DBFRAMESIZE+1];
	
	len=recv(dbsock,message,DBFRAMESIZE,MSG_DONTWAIT); 

	if(len == DBFRAMESIZE){
		parsetbl_t *parseptr;
		unsigned char *mptr;

		message[DBFRAMESIZE]='\0';
		
		/* received something, must be connected */
		connected=true;

		g_err(NOEXIT,NOPERROR,"DB->UDP:%d: [ %*s ]",len,len,message);
		
		/* worlds simplest parser */

		/* terminate the cmnd and move ptr to first arg */
		for(mptr=message;(*mptr!=' ')&&(*mptr!='\0');mptr++);
		if(*mptr == ' ')
			*mptr++ ='\0';
		/* look up command in table */
		for(parseptr=parsetbl;parseptr->request != NULL;parseptr++){
		    if(strcmp(parseptr->request,message) == 0){
			    parseptr->func(mptr);
			    break;
			}
		}
		if(parseptr->request == NULL){
			
			{
			char outgoing[DBPACKETSIZE+1];
			int n;
			memset(outgoing,PADCHAR,DBPACKETSIZE);
			outgoing[DBPACKETSIZE]='\0';	//defensive

			if((n=snprintf(outgoing,DBPACKETSIZE,
				"{\"type\":\"%s\","
				  "\"id\":\"%s\","
				  "\"errinfo\":\"%.80s\","
				  "\"time\":\"%lu.0\","
				 "\"pad\":\"",
					"BADCMND",	//start of args
					deviceID,
					message,
					time(NULL)
				)) >= DBPACKETSIZE)
					g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
				else
					outgoing[n]=PADCHAR;//get rid of null term in json

			outgoing[DBPACKETSIZE-2]='"';
			outgoing[DBPACKETSIZE-1]='}';
			sendToDB(outgoing);
			g_err(NOEXIT,NOPERROR,"Bad command DB->UDP: %s",message);
			g_err(NOEXIT,NOPERROR,"UDP->DB: %.*s",DBPACKETSIZE,outgoing);
			}
		}

		return(true);
	}

	else if(len == 0){
		g_err(NOEXIT,PERROR,"%s: len=0,client socket disconnected",__FUNCTION__); 
		connected=false;
	}
	
	else if(len < 0){
		if( (errno == ENOTCONN) || 
		    (errno == EPIPE)    || 
		    (errno == ECONNRESET) ||
		    (errno == ECONNREFUSED) ){
			g_err(NOEXIT,PERROR,"%s: socket not connected",__FUNCTION__);
			connected=false;
		}
		else
			g_err(NOEXIT,PERROR,"%s: recv error: failed to read from DB socket",
				__FUNCTION__);
	}
	
	else if(len < DBFRAMESIZE){
		char tbuf[256];
		snprintf(tbuf,200,"%s",message);
		g_err(NOEXIT,NOPERROR,
		   "%s: recv msg len %d not DBFRAMESIZE\nscrambled queue!\n%s",
			__FUNCTION__,len,tbuf);
	}
	
	return(false);
}

bool
sendHello(void){
	int len;
	int n;
	char buf[DBPACKETSIZE];
	char *cptr,*bufptr;
	int myflags;

	//g_err(NOEXIT,NOPERROR,"hello time");

	/* create the fixed lenght packet */
	memset(buf,PADCHAR,DBPACKETSIZE);

	n=sprintf(buf, "{\"type\":\"HELLO\",\"id\":\"%s\",\"pad\":\"",
			deviceID);
	buf[n]=PADCHAR;
	buf[DBPACKETSIZE-1]='}';
	buf[DBPACKETSIZE-2]='\"';

	g_err(NOEXIT,NOPERROR,"UDP->DB:%d: [ %.*s ]",DBPACKETSIZE,DBPACKETSIZE,buf);
	len=send(dbsock,buf,DBPACKETSIZE,MSG_DONTWAIT|MSG_NOSIGNAL); 

	if(len==DBPACKETSIZE){
		connected=true;
		return(true);
	}

	else if(len == 0){
		g_err(NOEXIT,NOPERROR,"%s: Disconnected from dbase socket",__FUNCTION__); 
	}
	else if(len < 0){
		if( (errno == ENOTCONN) || 
		    (errno == EPIPE)    || 
		    (errno == ECONNRESET) ||
		    (errno == ECONNREFUSED) ){
			g_err(NOEXIT,PERROR,"%s:SOCKET ERROR DB socket not connected",__FUNCTION__);
			connected=false;
		}
		else
			g_err(NOEXIT,PERROR,"%s: failed to send to DB socket",__FUNCTION__);
	}
	return(false);
}

