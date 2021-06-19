
#include <sys/types.h>
#include <stdio.h>      /* for printf() and fprintf() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <libgen.h>     /* for atoi() and exit() */
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

bool unitToSubunit(unsigned char *devid, unsigned char *locIDstring);

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
	bool outgoingDBtraffic;
	bool outgoingHank;
	unsigned int msgnum;
	int outgoingsize;
	struct timeval tv;
	int n;

	static int logfd=-1;

	outgoingDBtraffic=false;
	outgoingHank=false;


	switch(incoming[0]){
		/* accelerometer data coming in */
		case ACCELDATA:
			{
			float mag;
			float arrx;
			float arry;
			float arrz;
			char locIDstring[128];;


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

			unitToSubunit(deviceID,locIDstring);

			microsecs=(secs*1000*1000)+(usecs);
			mag=sqrtf(powf(arrx,2)+powf(arry,2)+powf(arrz,2));
			memset(outgoing,PADCHAR,size);
			if((n=snprintf(outgoing,size,
				"{ \"type\":\"acceleration\","
				  "\"id\":\"%s\","
				  "\"magnitude\":%.2f,"
				  "\"x\":%.2f,"
				  "\"y\":%.2f,"
				  "\"z\":%.2f,"
				  "\"time\":%lu.%06lu,"
				 "\"pad\":\"",
				locIDstring,
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
			//pressure can only go up or down +/-.02% / sample
			{
			static bool inited=false;
			static float simpress=5000.0;
			double rnum;
			if(!inited){
				inited=true;
				srand48(time(NULL));
			}
			rnum=drand48();
			rnum=(2*(rnum-.5)); //yields -1 to +1
			rnum*=.002; //only let move max 20% at a time up or down
			printf("rnumadj: %f\n",rnum);
			simpress *= (1+rnum);
			pressure=simpress;
			}
#endif
			microsecs=(secs*1000*1000)+(usecs);
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


		case BRIDGEDATA:
			{
			
			float t0, t1, t2, t3, t4, t5, t6, t7;
			float temp;
			int hum;
			int count;

			sscanf(incoming,"%s %s %f %f %f %f %f %f %f %f %f %d %d %lx %lx %x",
				ptype,
				deviceID,
				&t0, &t1, &t2, &t3, &t4, &t5, &t6, &t7,
				&temp,
				&hum,
				&count,
				&secs,
				&usecs,
				&msgnum
			);
			
			microsecs=(secs*1000*1000)+(usecs);
			memset(outgoing,PADCHAR,size);
			if((n=snprintf(outgoing,size,
                                "{ \"type\":\"environmental\","
                                  "\"id\":\"%s\","
                                  "\"sensors\":[ %.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f],"
                                  "\"temperature\":%.1f,"
                                  "\"humidity\":%d,"
                                  "\"count\":%d,"
                                  "\"time\":%lu.%06lu,"
                                  "\"pad\":\"",
                                deviceID,
                                t0, t1, t2, t3, t4, t5, t6, t7,
                                temp,
                                hum,
                                count,
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

		case BRIDGEDEFLECT:
			{
			float deflection;
			sscanf(incoming,"%s %s %f %lx %lx %x",
				ptype,
				deviceID,
				&deflection,
				&secs,
				&usecs,
				&msgnum
			);
			
			microsecs=(secs*1000*1000)+(usecs);
			memset(outgoing,PADCHAR,size);
			if((n=snprintf(outgoing,size,
                                "{ \"type\":\"deflection\","
                                  "\"id\":\"%s\","
                                  "\"deflection\":%.1f,"
                                  "\"time\":%lu.%06lu,"
                                  "\"pad\":\"",
                                deviceID,
                                deflection,
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
			{
			char buf[2048];
			char *tptr;
			time_t a;
			if(logfd<0){
			    char obuf[2048];
			    char *logfile;
			    strcpy(buf,program_path());
			    //basename may modify buf so don't pass it program_path()
			    tptr=basename(buf);
			    //allocate a buffer for the path plus an extra / and a \0 and an E_
			    logfile=malloc(strlen(LOGPATH) + strlen(tptr) + 16 + 5);
			    strcpy(logfile,LOGPATH);
			    strcat(logfile,"/MSGLOG");
			    strcat(logfile,".log");
			    sprintf(obuf,"%05d",logfileseed);
			    strcat(logfile,obuf);
			    printf("log message file is %s\n",logfile);
			    if((logfd=open(logfile,(O_SYNC|O_WRONLY|O_APPEND|O_CREAT),
			        (S_IRWXU|S_IRWXG|S_IRWXO)) )<0){
				    g_err(NOEXIT,PERROR,"%05d %s COULD NOT OPEN LOG MESSAGE FILE %s\n", 
				    getpid(),stamp(),logfile);
			    }
			    free(logfile);
			}

			g_err(NOEXIT,NOPERROR,"LOG DATA: %s\n",incoming);
			a=time(NULL);
			tptr=ctime(&a);
			tptr[strlen(tptr)-1]='\0';
			n=snprintf(outgoing,size, "[ %s ] %s\n", tptr, incoming+2);
			if(logfd>0)
				write(logfd,outgoing,n);
			}
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
		/*g_err(NOEXIT,NOPERROR,
			"hank->hank:PATH %s, msg num: %d,  Jitter: %.4f mS",
			infoptr,
			msgnum&0x0FFF,
			jitter); */

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



bool
unitToSubunit(unsigned char *devid, unsigned char *locIDstring)
{
	int subunit;
	/* convert unit:subunit to unit and subunit */
	for(devid=deviceID;*devid!='\0';devid++){
		*locIDstring=*devid;
		if(*devid==':'){
			*devid='\0';
			sscanf(devid+1,"%d",&subunit);
			sprintf(locIDstring,"\",\"sub\":\"%d",subunit);
			return(true);
		}
		locIDstring++;
	}
	return(false);
}
