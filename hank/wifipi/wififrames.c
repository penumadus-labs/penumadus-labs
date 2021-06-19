
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
#include <protocol.h>
#include <wifipi.h>

extern int bigindex;

void printApiFrame(unsigned char *frame);
extern unsigned char nextChar(int len);
bool checkchar(unsigned char *frame);

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

	fprintf(stderr,"\n%d: Recv %s:-------------------\n",bigindex++,__FUNCTION__);
	printApiFrame(frame);
	if((checksum & 0xFF) != 0xFF){
		g_err(NOEXIT,NOPERROR,"Bad Checksum: 0x%02x",checksum);
		return(BADCHECKSUM);
	}
	
	fprintf(stderr,"%d: final len: %d\n",bigindex++,len+3);

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


/* construct an xbee api frame
 * with checksum and header to send to xbee
 */
unsigned char *
makeApiFrame(unsigned char frameType, 
		unsigned char *data, 
		short datalen,
		unsigned char *frame)
{

	/* frame is
	 * 0x7e lenhi lenlo frametype databytes checksum
	 */

	int i;
	unsigned char *dptr, *fptr;
	int checksum;	//checksum accumulator (add all bytes, mask, sub from 0xff

	frame[DELIMITER]=0x7E;

	datalen++;		//to include FRAMETYPE
	frame[LENHI]=(datalen>>8)&0xFF;
	frame[LENLO]=datalen&0xFF;

	frame[FRAMETYPE]=frameType;

	dptr=data;
	fptr=frame+FRAMEDATA;
	for(i=0;i<datalen;i++){
		*fptr++ =*dptr++;
	}

	checksum=0;
	for(i=FRAMETYPE;i<datalen+FRAMETYPE;i++){
		checksum+=frame[i];
	}
	checksum &= 0xFF;
	checksum = 0xFF - checksum;
	frame[i]=(unsigned char)checksum;
	frame[i+1]='\0';
	return(frame);
}
	
/* send an api frame to hank and 
 * escape any control characters by stuffing
 */
void
sendApiFrame(unsigned char *frame){
	int i;
	int len;
	int stuffedlen;
	unsigned int sent;
	unsigned char buf[MAXFRAMEBUF];
	
	memset(buf,0,MAXFRAMEBUF);

	/* frame to be sent */
	fprintf(stderr,"\n%d: %s:-------------------\n",bigindex++,__FUNCTION__);
	printApiFrame(frame);

	len=(((unsigned int)(frame[LENHI]))<<8)|frame[LENLO];

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

	//printApiFrame(buf);

	i=write(s_fd,buf,stuffedlen);
					
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

	fprintf(stderr,"%d: Len:%d: FrameData:\n",bigindex++,len);

	index=0;
	if(rows > 0){
		for(j=0;j<rows;j++){
			rowout(index,NUMPERROW,frame);
			index+=NUMPERROW;
		}
	}
	rowout(index,rem,frame);
}

