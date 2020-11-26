

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

//string to be sent to UDP server as a QUERY to see if WIFI is UP
#define WIFIQUERYSTRING "C WIFIQUERY"    
//expected downstream response
#define WIFIQUERYRESP "U UP!"    //what UDPserver should return
#define SHUTDOWNLOOP    "U SHUTDOWN"  //a command to wifip, not hank, on its UDP interface


/* wifi equivalent of xbee cell.  maintain link and send data over wifi if avail */

int setupListener(unsigned short port);
int wifisock=0;
extern bool wifi_avail;

void * udp_holdConnection(void *arg);
void * udp_readthreadproc(void *arg);

static struct sockaddr_in amazonhank; /* Echo server address */

bool
wifisetup(unsigned char *addr, unsigned short port)
{

    pthread_t udpcommthread1;
    pthread_t udpcommthread2;

    wifisock=setupListener(port);

    /* Construct the server address structure */
    memset(&amazonhank, 0, sizeof(amazonhank));    /* Zero out structure */

    amazonhank.sin_family = AF_INET;                 /* Internet addr family */
    amazonhank.sin_addr.s_addr = inet_addr(addr);  /* Server IP address */
    amazonhank.sin_port   = htons(port);     /* Server port */

    /* start udp readthread from amazon and udp connection hold thread */
    if(pthread_create(&udpcommthread1,NULL,&udp_holdConnection,(void *)(NULL)) != 0)
	    g_err(EXIT,PERROR,"%s: Could not create reader thread %d\n",__FUNCTION__);
    
    if(pthread_create(&udpcommthread2,NULL,&udp_readthreadproc,(void *)(NULL)) != 0)
	    g_err(EXIT,PERROR,"%s: Could not create reader thread %d\n",__FUNCTION__);

}

bool
sendtoamazon(unsigned char *msg, int len)
{

    int n;

    /* Send the string to the server */
    g_err(NOEXIT,NOPERROR,"WIFI: HANK->UDPengine [%.*s]",len,msg);
    if ((n=sendto(wifisock, msg, len, 0, (struct sockaddr *)
               &amazonhank, sizeof(amazonhank))) != len){
		g_err(NOEXIT,PERROR,"%s: Failed req len:%d actual len: %d [%s]",
			__FUNCTION__,n,len,msg);
		return(false);
    }
    else
	    return(true);
}


void *
udp_holdConnection(void *arg){

        char *bufptr=WIFIQUERYSTRING;
        g_err(NOEXIT,NOPERROR,"%s: hold connect thread started\n",__FUNCTION__);
        while (true){
		if(sendtoamazon( bufptr, strlen(bufptr))){
			//g_err(NOEXIT,NOPERROR,"WIFIPI->UDP success sent link hold");
		}
		else{
			g_err(NOEXIT,NOPERROR,"%s: Wifi Down",__FUNCTION__);
			wifi_avail=false;
                }
                sleep(LINKCHECKINTERVAL);
        }
}


/* thread to read main udp port and process */
void *
udp_readthreadproc(void *arg){

        struct sockaddr_in incomingAddr; /* Client address */
        unsigned int incomingAddrLen;         /* Length of incoming message */
        int recvMsgSize;
        char incomingBuf[BIGBUF];
        static long messagecnt=0;;
        unsigned char frame[MAXFRAMEBUF];
        unsigned char buf[32];

        g_err(NOEXIT,NOPERROR,"%s: UDP readthread started\n",__FUNCTION__);
        while(true){
                /* receive incoming message */
                incomingAddrLen = sizeof(incomingAddr);
                if ((recvMsgSize = recvfrom(wifisock, incomingBuf, BIGBUF, 0,
                    (struct sockaddr *) &incomingAddr, &incomingAddrLen)) < 0){
                        g_err(NOEXIT,PERROR,"Could Recv From Socket");
			sleep(2);
			continue;
                }

                incomingBuf[recvMsgSize]='\0';
                messagecnt++;

                //send status report to hank
                //to let him know we are up.
                if(strncmp(incomingBuf,
                            WIFIQUERYRESP,
                            sizeof(WIFIQUERYRESP)-1)==0) {

                        g_err(NOEXIT,NOPERROR,"WIFI/UDPserver AVAIL");
			wifi_avail=true;
                }


                //unknown message
                else {
                        g_err(NOEXIT,NOPERROR,
                            "UDP->HANK:%d: Unknown command [ %.*s ]",recvMsgSize,recvMsgSize,incomingBuf);
                }//end if for hank
        }//end while true
}//end udpreadthread


