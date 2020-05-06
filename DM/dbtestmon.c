#include <stdio.h>      /* for printf() and fprintf() */
#include <sys/socket.h> /* for socket(), connect(), send(), and recv() */
#include <arpa/inet.h>  /* for sockaddr_in and inet_addr() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <string.h>     /* for memset() */
#include <unistd.h>     /* for close() */
#include <time.h>     /* for close() */
#include <pthread.h>     /* for close() */
#include <bool.h>
#include <utils.h>
#include <servercomms.h>

struct sockaddr_in controlDBIp;

extern int errfd;

int infd;
char deviceID[64]="UnInitialized";
int portsetup(char *);
void restoretty();
void docommand(int clntsock, char *buf);
    int clntSock;
    char lastcmnd[DBPACKETSIZE];

    time_t timestamp=0;

int main(int argc, char *argv[])
{
    int sock;                        /* Socket descriptor */
    struct sockaddr_in echoServAddr; /* Echo server address */
    struct sockaddr_in clntAddr; /* Echo server address */
    unsigned short echoServPort;     /* Echo server port */
    char *servIP;                    /* Server IP address (dotted quad) */
    char *echoString;                /* String to send to echo server */
    char echoBuffer[DBPACKETSIZE+1];     /* Buffer for echo string */
    unsigned int echoStringLen;      /* Length of string to echo */
    int bytesRcvd;   /* Bytes read in single recv() */
    void *kbd_readthreadproc(void *arg);
    pthread_t kbd_readthread;	     /* thread to serial from UDP*/
    unsigned int tsize;   
	char inbuf[16];
	time_t lastime=0;

	errfd=2;

	/* so can get single char input to give commands */
	infd=portsetup("/dev/tty");

	/* start the kbd thread */
	if(pthread_create(&kbd_readthread,NULL,kbd_readthreadproc,NULL) != 0){
		g_err(EXIT,PERROR,"%s Failed to start kbd_readthreadproc",__FUNCTION__);
	}
        servIP = "127.0.0.1";
        echoServPort = 32100;  
    /* Create a reliable, stream socket using TCP */
    if ((sock = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP)) < 0)
        g_err(EXIT,PERROR,"socket() failed");

    /* Construct the server address structure */
    memset(&echoServAddr, 0, sizeof(echoServAddr));     /* Zero out structure */
    echoServAddr.sin_family      = AF_INET;             /* Internet address family */
    echoServAddr.sin_addr.s_addr = inet_addr(servIP);   /* Server IP address */
    echoServAddr.sin_port        = htons(echoServPort); /* Server port */


	/* Got a socket, now Bind to the local address and port */
	if (bind(sock,
		(struct sockaddr *)&echoServAddr,
		sizeof(echoServAddr)) < 0) {
			g_err(EXIT,PERROR,
				"dbtestmon: bind() to controlDBIp failed");
	}
	  
	if (listen(sock, MAXPENDING) < 0){
		g_err(EXIT,PERROR,"dbtestmon:listen() failed");
	}

while(true){
	tsize=sizeof(clntAddr);
	fprintf(stderr,"bout to Accept\n");
	if((clntSock=accept(sock, 
	     (struct sockaddr *)&clntAddr,(socklen_t *)&tsize)) < 0){
		fprintf(stderr,"fail\n");
		g_err(EXIT,PERROR,"dbtestmon:accept() to echoServAddr failed");
	}
	else{
		fprintf(stderr,"pass\n");
		g_err(NOEXIT,NOPERROR,"Connect from %s:%d\n",
			inet_ntoa(clntAddr.sin_addr),ntohs(clntAddr.sin_port));
	}

	fprintf(stderr,"Accepted\n");
	timestamp=time(NULL);
        /* Receive the same string back from the server */
        while (true)
        {
            /* Receive up to the buffer size (minus 1 to leave space for
               a null terminator) bytes from the sender */
            if ((bytesRcvd = recv(clntSock, echoBuffer, DBPACKETSIZE , MSG_NOSIGNAL)) < 0)
                g_err(EXIT,PERROR,"recv() failed");
	    else if(bytesRcvd == 0){
                g_err(NOEXIT,NOPERROR,"connection closed");
	        break;
	    }
            echoBuffer[bytesRcvd] = '\0';  /* Terminate the string! */
	    {
		    char tmp[DBPACKETSIZE];
		    //g_err(NOEXIT,NOERROR,"%.20s",
		    sscanf(echoBuffer+9,"%s",tmp);
		    if(strncmp(tmp,"GETIP",5)==0){
			    printf("****time:%d\n",(int)(time(NULL)-timestamp));  
		    }	
	    }
            printf("bytes:%d\n%s\n", bytesRcvd,echoBuffer);      /* Print the echo buffer */
	    
	    bytesRcvd=0;
	    fflush(stdout);
    
        }
	close(clntSock);
}

}

void
docommand(int clntsock, char *buf){
	char locbuf[DBFRAMESIZE];
	int len;
	memset(locbuf,PADCHAR,DBFRAMESIZE);
	switch(*buf){
		case 'S':
			//shutdown
			g_err(NOEXIT,NOPERROR,"Do shutdown");	
			len=sprintf(locbuf,"SHUTDOWN");
			locbuf[len]=PADCHAR;
			break;
		case 'P':
			g_err(NOEXIT,NOPERROR,"Do getpress");	
			len=sprintf(locbuf,"GETPRESS");
			locbuf[len]=PADCHAR;
			break;

		case 'Q':
			//quit
			g_err(NOEXIT,NOPERROR,"Quit");	
			restoretty();
			exit(0);
			break;
		case 'A':
			//SETIP
			g_err(NOEXIT,NOPERROR,"SETIP");	
			len=sprintf(locbuf,"SETIP 192.168.12.21 32159");
			locbuf[len]=PADCHAR;
			break;
		case 'B':
			//GETIP
			g_err(NOEXIT,NOPERROR,"GETIP");	
			len=sprintf(locbuf,"GETIP");
			locbuf[len]=PADCHAR;
			break;
//NOT YET
		case 'D':
			//SETPRESS PARAMS
			g_err(NOEXIT,NOPERROR,"SETPRESS 10 60 2 30 100.0 7.0  2.0");	
			len=sprintf(locbuf,"SETPRESS 10 60 2 30 100.0 7.0  2.0");
			locbuf[len]=PADCHAR;
			break;

		case 'T':
			//TIME
			g_err(NOEXIT,NOPERROR,"TIME");	
			len=sprintf(locbuf,"TIME");
			locbuf[len]=PADCHAR;
			break;
		case 'C':
			//COMMIT
			g_err(NOEXIT,NOPERROR,"COMMIT");	
			len=sprintf(locbuf,"COMMIT");
			locbuf[len]=PADCHAR;
			break;
		case 'E':
			//ERASE SD
			g_err(NOEXIT,NOPERROR,"ERASE SD");	
			len=sprintf(locbuf,"ERASESD");
			locbuf[len]=PADCHAR;
			break;
		case 'R':
			//Get sample params
			g_err(NOEXIT,NOPERROR,"Get sample params");	
			len=sprintf(locbuf,"GETSAMPLEPARAMS");
			locbuf[len]=PADCHAR;
			break;
		case 'U':
			//Set sample params
			g_err(NOEXIT,NOPERROR,"Set sample params");	
			len=sprintf(locbuf,"SETSAMPLEPARAMS 5 100 8");
			locbuf[len]=PADCHAR;
			break;
		case 'V':
			//Get accel params
			g_err(NOEXIT,NOPERROR,"Get accel params");	
			len=sprintf(locbuf,"GETACCELPARAMS");
			locbuf[len]=PADCHAR;
			break;
		case 'W':
			//Set accel params
			g_err(NOEXIT,NOPERROR,"Get accel params");	
			len=sprintf(locbuf,"SETACCELPARAMS 4.2");
			locbuf[len]=PADCHAR;
			break;
		case 'X':
			//Set device name
			g_err(NOEXIT,NOPERROR,"Get accel params");	
			len=sprintf(locbuf,"GETDEVICENAME");
			locbuf[len]=PADCHAR;
			break;
		case 'H':
			//Set device name
			g_err(NOEXIT,NOPERROR,"reset params");	
			len=sprintf(locbuf,"RESETDEVICE");
			locbuf[len]=PADCHAR;
			break;
		case 'I':
			//Set device name
			g_err(NOEXIT,NOPERROR,"bad cmnd");	
			len=sprintf(locbuf,"HEYTHISISBAD 1 2 3");
			locbuf[len]=PADCHAR;
			break;
		case 'Y':
			{
			//Set device name
			char *cptr;
			if((cptr=getenv("DEV"))==NULL){
				cptr="unit1";
			}
			g_err(NOEXIT,NOPERROR,"Set dev name to %s",
				cptr);	
			len=sprintf(locbuf,"SETDEVICENAME %s",cptr);
			locbuf[len]=PADCHAR;
			}
			break;
		default:
			g_err(NOEXIT,NOPERROR,"Badcmnd: %c",*buf);	
			break;
	}

	g_err(NOEXIT,NOPERROR,"DBTESTMON->UDP: [ %.*s ]",DBFRAMESIZE,locbuf);
	len=send(clntsock,locbuf,DBFRAMESIZE,MSG_NOSIGNAL); 
	if(len==DBPACKETSIZE)
		g_err(NOEXIT,NOPERROR,"%s: success",__FUNCTION__);
	else
		g_err(NOEXIT,PERROR,"%s: failed",__FUNCTION__);
}

//just a stub to make dbcomms load
bool
hankCommand(unsigned char *command,
	int cmndsize, 
	const char *requestor)
{
	return(true);
}


/* thread to read kbd and do commands*/
void *
kbd_readthreadproc(void *arg){

	char inbuf[64];
	while(true){
	    if(read(infd,inbuf,1) > 0){
		g_err(NOEXIT,NOPERROR,"GOT %c",inbuf[0]);
		timestamp=time(NULL);
		docommand(clntSock,inbuf);
	    }
	    else{
		g_err(NOEXIT,NOPERROR,"Bad Read",inbuf[0]);
	    }
	}
}//end kbdreadthread
