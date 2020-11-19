
/*********************************************************
* xbee serial interface mode 2 Network code below this point
* Copyright G. Laggis
* all rights reserved
*********************************************************/

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
#include <xbee.h>
#include <trans.h>

int statframes=0;
int ackframes=0;

char spbuf[2048];
int8_t highByte(int x){ return((x>>8)&0xFF); }
int8_t lowByte(int x){ return(x&0xFF); }
int packetcount=0;

/* construct an xbee api frame
 * with checksum and header to send to xbee
 */
void
makeApiFrame(char frameType, 
		unsigned char *data, 
		short datalen,
		unsigned char *apiFrame)
{

	/* frame is
	 * 0x7e lenhi lenlo frametype databytes checksum
	 */

	int i;
	unsigned char *dptr, *fptr;
	int checksum;	//checksum accumulator (add all bytes, mask, sub from 0xff

	apiFrame[DELIMITER]=0x7E;

	datalen++;		//to include FRAMETYPE
	apiFrame[LENHI]=highByte(datalen);	//insert lens
	apiFrame[LENLO]=lowByte(datalen);

	apiFrame[FRAMETYPE]=frameType;

	dptr=data;
	fptr=apiFrame+FRAMEDATA;
	for(i=0;i<datalen;i++){
		*fptr++ =*dptr++;
	}

	checksum=0;
	for(i=FRAMETYPE;i<datalen+FRAMETYPE;i++){
		checksum+=apiFrame[i];
	}
	checksum &= 0xFF;
	checksum = 0xFF - checksum;
	apiFrame[i]=(unsigned char)checksum;
}
	
/* send an api frame to xbee and 
 * escape any control characters by stuffing
 */
void
sendApiFrame(unsigned char *frame, int serialPort){
	int i;
	int len;
	int stuffedlen;
	unsigned int sent;
	unsigned char buf[MAXFRAMEBUF];

	/* frame to be sent */
	//printApiFrame(frame);

	len=(frame[LENHI]<<8)|frame[LENLO];

	//gotta escape characters in mode 2
	/* +1 here to include checksum  which also must be stuffed */
	/* even though its not in length */
	stuffedlen=0;
	buf[stuffedlen++]=frame[0];
	for(i=1;i<len+FRAMETYPE+1;i++){
		switch( frame[i] ){
			case 0x7e:
			case 0x7d:
			case 0x11:
			case 0x13:
				buf[stuffedlen++]=0x7d;  //7d is the flag byte
				buf[stuffedlen++]=frame[i]^0x20; //XOR to mod offending byte
				break;
			default:
				buf[stuffedlen++]=frame[i];
				break;
		}
	}

#ifdef FULL_DEBUG
	fprintf(stderr,"\nPI->xbee %s:-------------------\n",__FUNCTION__);
	printApiFrame(buf);
#endif

        pthread_mutex_lock(&apilock);
	sent=write(serialPort,buf,stuffedlen);
        pthread_mutex_unlock(&apilock);
#ifdef FULL_DEBUG
	fprintf(stderr,"Sent: %d\n",sent);
#endif
					
}

/* assist func for printApiFrame */
void 
rowout(int index, int todo, unsigned char *frame){
	int i;
	for(i=0;i<todo;i++)
		fprintf(stderr,"%02X ",frame[i+index]);
	fprintf(stderr,"\n");
	for(i=0;i<todo;i++){
		if( (frame[i+index] >= 0x20) && (frame[i+index] < 0x7F) )
			fprintf(stderr," %c ",frame[i+index]);
		else
			fprintf(stderr,"   ");
	}
	fprintf(stderr,"\n");
	for(i=0;i<todo;i++)
		fprintf(stderr,"%02d ",i+index);
	fprintf(stderr,"\n");
}

#define NUMPERROW 16
/* print a frame based on its internal length */
void
printApiFrame(unsigned char *frame){

	int j;
	int len;
	int rows;
	int rem;
	int index;

	
	len=(((unsigned int)(frame[LENHI]))<<8)|frame[LENLO];

	rows=(len+FRAMETYPE+1)/NUMPERROW;
	rem=(len+FRAMETYPE+1)%NUMPERROW;

	fprintf(stderr,"Len:%d: FrameData:\n",len);

	index=0;
	if(rows > 0){
		for(j=0;j<rows;j++){
			rowout(index,NUMPERROW,frame);
			index+=NUMPERROW;
		}
	}
	rowout(index,rem,frame);
}


