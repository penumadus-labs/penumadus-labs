
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
#include <calib.h>

/* error printing routine */
void g_err( char * errbuf, bool EXITSTAT, bool PERRNO);

int16_t packedToInt16(char *buf, int offset);

int
parsedata(char *incoming, char *outgoing, int size)
{

	char errbuf[256];

	char ptype[2];
	char deviceID[64];
	char deviceReg[64];
	unsigned long secs;
	unsigned long usecs;
	unsigned long long nanosecs;
	bool outgoingDBtraffic=false;
	unsigned int msgnum;


	printf("INCOMING: %s",incoming);

	switch(incoming[0]){
		/* accelerometer data coming in */
		case 'A':
			{
			float mag;
			float arrx;
			float arry;
			float arrz;
			sscanf(incoming,"%s %s %s %f %f %f %lx %lx %x",
				ptype,
				deviceID,
				deviceReg,
				&arrx,
				&arry,
				&arrz,
				&secs,
				&usecs,
				&msgnum
			);
			nanosecs=(secs*1000*1000*1000)+(usecs*1000);
			mag=sqrtf(powf(arrx,2)+powf(arry,2)+powf(arrz,2));
			sprintf(outgoing,
			   "%s,location=%s mag=%.2f,x_axis=%.2f,y_axis=%.2f,z_axis=%.2f %lld\n",
				deviceID,
				deviceReg,
				mag,
				arrx,
				arry,
				arrz,
				nanosecs 
			);
			}
			outgoingDBtraffic=true;
			break;

		/* regular pressure data coming in */
		case 'D':
			{
			float pressure;
			int fills;
			int temp;
			int hum;
			sscanf(incoming,"%s %s %s %f %d %d %d %lx %lx %x",
				ptype,
				deviceID,
				deviceReg,
				&pressure,
				&fills,
				&temp,
				&hum,
				&secs,
				&usecs,
				&msgnum
			);
			nanosecs=(secs*1000*1000*1000)+(usecs*1000);
			sprintf(outgoing,"%s,location=%s pressure=%f,filled=%d,temp=%d,hum=%d %lld\n",
				deviceID,
				deviceReg,
				pressure,
				fills,
				temp,
				hum,
				nanosecs
			);
			}
			outgoingDBtraffic=true;
			break;

		/* log data coming in */
		case 'L':
			sprintf(errbuf,"***LOG DATA: %s\n",incoming);
			g_err(errbuf,false,false);
			outgoingDBtraffic=false;
			break;

		/* log data coming in */
		case 'C':
			sprintf(errbuf,"***CMND REQUEST: %s\n",incoming);
			//PONDSCUM call a command processor here.  time requests should
			//eventually go here as well
			g_err(errbuf,false,false);
			outgoingDBtraffic=false;
			break;

		default:
			sprintf(errbuf,"Bad Command from Sensor: %s",incoming);
			g_err(errbuf,false,false);
			outgoingDBtraffic=false;
			break;
	}


	if(outgoingDBtraffic){
		unsigned long long nanosecs1;
		struct timeval tv;
		float jitter;
		char *infoptr;
		char littlebuf[128];

		sprintf(errbuf,"\nOUTGOING: %s",outgoing);
		g_err(errbuf,false,false);
		gettimeofday(&tv,NULL);
		nanosecs1= tv.tv_sec*1000*1000*1000+tv.tv_usec*1000;
		//sprintf(errbuf,"Server Time: %24lld\n",nanosecs1);
		//g_err(errbuf,false,false);
		//sprintf(errbuf,"Sensor Time: %24lld\n",nanosecs);
		//g_err(errbuf,false,false);
		jitter=(float)((nanosecs1-nanosecs)/(1000.0*1000.0));
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
		sprintf(errbuf,"msg num: %d:  path:%s Jitter: %.2f \n\n",
			msgnum&0x0FFF,
			infoptr,
			jitter);
		g_err(errbuf,false,false);

		return(strlen(outgoing));
	}
	else{
		return(0);
	}

}

int16_t
packedToInt16(char *buf, int offset)
{
	int16_t tmpint;
	buf+=offset;

	tmpint= ( (*buf)<<8 ) | ( (*(buf+1))&0x00FF);
	return(tmpint);
}
