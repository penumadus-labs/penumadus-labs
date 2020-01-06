/* generic interface file to act as web page, parse commands, 
   and send to UDPengine */

#include <unistd.h>
#include <stdio.h>      /* for printf() and fprintf() */
#include <sys/socket.h> /* for socket(), connect(), sendto(), and recvfrom() */
#include <arpa/inet.h>  /* for sockaddr_in and inet_addr() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <string.h>     /* for memset() */
#include <unistd.h>     /* for close() */
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>
#include <termios.h>
#include "bool.h"
#include "stub.h"
#include "utils.h"

bool sendUDPmsg(char *msg);
void endpage(char *pageredirect);

int
main (int argc,  char *argv[] )
{
	char buf[ECHOMAX];
	char errbuf[ECHOMAX];
	long i;
	char *arg;
	char *value;
	int numargs;

	struct queryargs_t queryargs[MAXARGS]; //see utils.h

	
	/* parse the incoming environment string with args in it into name value pairs */
	
	numargs = parseArgsHTML(queryargs,MAXARGS);
	
	if(numargs == 0){

		g_err("NULL QUERY\n",true,false);
	}
	else{
		g_err("IN STUB\n",false,false);
	}

	//iterate through args and parse
	//CARO decide on protocol and update
	for(i = 0; i < numargs; i++){
		arg = queryargs[0].tag;
		value = queryargs[0].value;
		if(value == NULL){
			value = "none";
		}

		sprintf(buf,"%ld: cmnd:%s value:%s\n",(long)getpid(),arg,value); //spit out recieved vals
		g_err(buf,false,false);

		if(strcmp(arg,"LOG") == 0){
			sprintf(buf,"L %s",value);
			sendUDPmsg(buf);
		}
		else if(strcmp(arg,"NONE") == 0){
			sprintf(buf,"L %s",value);
			sendUDPmsg(buf);
		}
		else{
			sprintf(buf,"Unrecognized stub command %s",arg);
			g_err(buf,false,false);
		}
	}
	
	endpage(NULL);
	exit(0);
}

/* sends back some javascript to redirect if got here by a link so don't */
/* keep repeating actions. normal ajax ignores this */
void
endpage(char *pageredirect){

	char buf[512];
	char *content;
	/* this return html is completely ignored by the javascript */
	/* only used if got here via a link not a POST from javascript */

	/* now redirect back to the original page */
	strcpy(buf,"http://");
	if((content=getenv("SERVER_NAME"))!=NULL){
		strcat(buf,content);
	}
	else{
		strcat(buf,UDPSERVERADDR);
	}
	if(pageredirect != NULL){
		strcat(buf,"/");
		strcat(buf,pageredirect);
	}
	else
		strcat(buf,"/index.html");

	printf("Content-type:  text/html\n\n");
printf("<!DOCTYPE HTML>\n");
printf("<meta charset=\"UTF-8\">\n");
printf("meta http-equiv=\"refresh\" content=\"1; url=%s\">\n",buf);
printf("\n");
printf("<script>\n");
printf("window.location.href=\"%s\"\n",buf);
printf("</script>\n");
printf("<title>Page Redirrection</title>\n");
printf("If you are not redirected automatically, follow the <a href=\"%s\">link to example </a>\n",buf);

}


/* send a UDP message to real engine */
bool 
sendUDPmsg(char *msg)
{
	static int sock=0;                        /* Socket descriptor */
	static struct sockaddr_in echoServAddr; /* Echo server address */
	unsigned short echoServPort;     /* Echo server port */
	int echoStringLen;               /* Length of string to echo */
	char lbuf[ECHOMAX];

	if( sock == 0){
		/* Create a datagram-UDP socket */
		if ((sock = socket(PF_INET, SOCK_DGRAM, IPPROTO_UDP)) < 0){
			g_err("could not create stub output socket",false,false);
			return(false);
		}

		/* Construct the server address structure */
		memset(&echoServAddr, 0, sizeof(echoServAddr));    /* Zero out structure */
		echoServPort = UDPSERVERPORT;  
		echoServAddr.sin_family = AF_INET;                 /* Internet addr family */
		echoServAddr.sin_addr.s_addr = inet_addr(UDPSERVERADDR);  /* Server IP address */
		echoServAddr.sin_port   = htons(echoServPort);     /* Server port */
	}

	/* Send the string to the server */
	sprintf(lbuf,"Sending: %s\n",msg);
	g_err(lbuf,false,false);
	echoStringLen=strlen(msg);
	if (sendto(sock, msg, echoStringLen, 0, (struct sockaddr *)
	       &echoServAddr, sizeof(echoServAddr)) != echoStringLen){
			g_err("sendto() sent different number of bytes than expected",false,false);
			return(false);
	}

return(true);
}
