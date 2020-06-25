
#include <sys/types.h>
#include <stdio.h>      /* for printf() and fprintf() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <errno.h>
#include <sys/fcntl.h>
#include <pthread.h>
#include <sys/socket.h> /* for socket() and bind() */
#include <arpa/inet.h>  /* for sockaddr_in and inet_ntoa() */
#include <semaphore.h>
#include <sys/mman.h>
#include <sys/time.h>
#include <math.h>
#include <string.h>     /* for memset() */
#include <unistd.h>     /* for close() */
#include <sys/select.h>
#include <bool.h>
#include <netcomms.h>
#include <protocol.h>
#include <utils.h>
#include <servercomms.h>
#include <parse.h>


/* parse routine for response to dbase from hank HANK->UDP->DB */
bool parseresponse(unsigned char *response, 
		unsigned char *outgoing, 
		int outgoingsize);

/* the response routines */
bool respGeneric(char *,char *,int);
bool respDevName(char *,char *,int );
bool respShutdown(char *,char *,int);
bool respPressParams(char *,char *,int);
bool respSampParams(char *,char *,int);
bool respAccelParams(char *,char *,int);


//storage for device ID to insert if not avail in or updated by a message
extern char deviceID[];
extern parsetbl_t parsetbl[];

/* initial parse routine for all messages from hank */
int
parsedata(char *incoming, char *outgoing, int size)
{

	char errbuf[256];

	char ptype[2];
	char deviceReg[64];
	unsigned long secs;
	unsigned long usecs;
	unsigned long long microsecs;
	bool outgoingDBtraffic=false;
	bool outgoingHank=false;
	unsigned int msgnum;
	int outgoingsize;
	struct timeval tv;
	int n;



	switch(incoming[0]){
		/* accelerometer data coming in */
		case ACCELDATA:
			{
			float mag;
			float arrx;
			float arry;
			float arrz;
			sscanf(incoming,"%s %s %f %f %f %lx %lx %x",
				ptype,
				deviceID,
				&arrx,
				&arry,
				&arrz,
				&secs,
				&usecs,
				&msgnum
			);
			microsecs=(secs*1000*1000)+(usecs);
			mag=sqrtf(powf(arrx,2)+powf(arry,2)+powf(arrz,2));
			memset(outgoing,PADCHAR,size);
			if((n=snprintf(outgoing,size,
				"{ \"type\":\"%c\","
				  "\"id\":\"%s\","
				  "\"magnitude\":%.2f,"
				  "\"x\":%.2f,"
				  "\"y\":%.2f,"
				  "\"z\":%.2f,"
				  "\"time\":\"%lu.%06lu\","
				 "\"pad\":\"",
				  ACCELDATA,	//start of args
				deviceID,
				mag,
				arrx,
				arry,
				arrz,
				secs,
				usecs 
			)) >= size)
				g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
			else
				outgoing[n]=PADCHAR;//get rid of null term in json
			outgoing[size-2]='"';
			outgoing[size-1]='}';
			outgoingDBtraffic=true;
			}
			break;

		/* regular pressure data coming in */
		case MAINDATA:
			{
			float pressure;
			int fills;
			int temp;
			int hum;
			sscanf(incoming,"%s %s %f %d %d %d %lx %lx %x",
				ptype,
				deviceID,
				&pressure,
				&fills,
				&temp,
				&hum,
				&secs,
				&usecs,
				&msgnum
			);
#ifdef SIMULATOR
			//PONDSCUM simulated pressure for testing
			//pressure can only go up or down +/-10% / sample
			{
			static bool inited=false;
			static float simpress=5000.0;
			double rnum;
			if(!inited){
				inited=true;
				srand48(0xfeedbeef);
			}
			rnum=drand48();
			rnum=(2*(rnum-.5)); //yields -1 to +1
			rnum*=.2; //only let move max 20% at a time up or down
			printf("rnumadj: %f\n",rnum);
			simpress *= (1+rnum);
			pressure=simpress;
			}
#endif
			//end PONDSCUM
			microsecs=(secs*1000*1000)+(usecs);
			memset(outgoing,PADCHAR,size);
			if((n=snprintf(outgoing,size,
				"{ \"type\":\"%c\","
				  "\"id\":\"%s\","
				  "\"pressure\":%.1f,"
				  "\"fills\":%d,"
				  "\"temperature\":%d,"
				  "\"humidity\":%d,"
				  "\"time\":\"%lu.%06lu\","
				  "\"pad\":\"",
				MAINDATA,
				deviceID,
				pressure,
				fills,
				temp,
				hum,
				secs,
				usecs
			)) >= size)
				g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
			else
				outgoing[n]=PADCHAR;//get rid of null term in json
			
			outgoing[size-2]='"';
			outgoing[size-1]='}';
			outgoingDBtraffic=true;
			}
			break;

		/* log data coming in */
		case LOG:
			g_err(NOEXIT,NOPERROR,"LOG DATA: %s\n",incoming);

			if((n=snprintf(outgoing,size,
				"{ \"type\":\"%c\",\"id\":\"%s\",\"log\":\"%s\",\"time\":\"%ld.%06ld\""
				  "\"pad\":\"",
				LOG,
				deviceID,
				incoming,
				time(NULL),
				(long)0
			))>=size)
				g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
			else{
				outgoing[n]=PADCHAR;//get rid of null term in json
			}
			outgoing[size-2]='"';
			outgoing[size-1]='}';
			outgoingDBtraffic=true;
			break;

		/* command coming in */
		case CMND:
			{

			outgoingDBtraffic=false;

			/* did we get a time request? */
			/* this are fixed cmnd strings witn no args so don't need cmnd check */
			if(strcmp(incoming,TIMESYNCREQSTRING)==0){

				if(gettimeofday(&tv,NULL) < 0){
					g_err(EXIT,PERROR,"time sync failed");
				}

				/* get the current time and echo back to sender */
				outgoingsize = sprintf(outgoing,RESYNCFORMAT,
					RESYNCTIME,
					(unsigned long)tv.tv_sec,
					(unsigned long)tv.tv_usec);
				
				outgoingHank=true;

				g_err(NOEXIT,NOPERROR,"UDP->hank ** SYNCED TIME ****");

			}//end time command

			/* did we get a wifiquery */
			/* this are fixed cmnd strings witn no args so don't need cmnd check */
			else if( strcmp(incoming,WIFIQUERYSTRING) ==0 ){
				outgoingsize = sprintf(outgoing,WIFIQUERYRESP);
				outgoingHank=true;
			}//end wifiquery command
				
			break;
			}//end new context for commands

		case RESPONSE:
			/* response from previous command */
			g_err(NOEXIT,NOPERROR,
				"Got response: %s",incoming);
			/* prep the DB buffer */
			memset(outgoing,PADCHAR,size);

			outgoingDBtraffic=
				parseresponse(incoming+2,
					 outgoing,
					  size);

			/* terminate the DB buffer */
			outgoing[size-2]='"';
			outgoing[size-1]='}';
			break;
			
		default:
			g_err(NOEXIT,NOPERROR,
				"Bad Command from Sensor: %s",incoming);
			outgoingDBtraffic=false;
			break;
	}


	if(outgoingDBtraffic){
		unsigned long long microsecs1;
		float jitter;
		char *infoptr;
		char littlebuf[128];

		gettimeofday(&tv,NULL);
		microsecs1= tv.tv_sec*1000*1000+tv.tv_usec;
		//g_err(NOEXIT,NOPERROR,"Server Time: %24lld\n",microsecs1);
		//g_err(NOEXIT,NOPERROR,"Sensor Time: %24lld\n",microsecs);
		jitter=(float)((microsecs1-microsecs)/(1000.0));
		switch(msgnum&0xF000){
			case 0x1000:
				infoptr=" ->ACCBAKQ->MEMQ->Net\t";
				break;
			case 0x2000:
				infoptr=" ->MEMQ->SD->Net\t";
				break;
			case 0x4000:
				infoptr=" ->MEMQ->Net\t";
				break;
			case 0x8000:
				infoptr=" ->SD->Net\t";
				break;
			default:
				sprintf(littlebuf,"complex status %04x\t",msgnum);
				infoptr=littlebuf;
				break;
		}
		g_err(NOEXIT,NOPERROR,
			"hank->hank:PATH %s, msg num: %d,  Jitter: %.4f mS",
			infoptr,
			msgnum&0x0FFF,
			jitter);

		return(size);
	}
	
	else if(outgoingHank)
		return(outgoingsize*-1);
	
	else
		return(0);
	

}

/* parse an incoming response from hank for send to database */
/* HANK->DB */
bool
parseresponse(unsigned char *response, 
		unsigned char *outgoing, 
		int outgoingsize)
{

	int offset;
	parsetbl_t *parseEntry;

	for(parseEntry=parsetbl;parseEntry->respfunc!=NULL;parseEntry++){
		if( parseEntry->cmndcode == *response){
			if( parseEntry->subcode == 0){
				offset=2;
				break;
			}
			else if(*(response+2)==parseEntry->subcode){
				offset=4;
				break;
			}
		}
	}

	if(parseEntry->respfunc == NULL){
		g_err(NOEXIT,NOPERROR,"%s: Unknown response %s",
				__FUNCTION__,response);
		return(false);
	}
	else{

		return( parseEntry->respfunc(response+offset, outgoing, 
				outgoingsize, parseEntry) );
	}

}

