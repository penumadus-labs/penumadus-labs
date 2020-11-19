
/* setup the serial port*/

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <termios.h>
#include <string.h>
#include <pthread.h>
#include <semaphore.h>
#include <sys/mman.h>

#include <bool.h>
#include <utils.h>

int
portsetup( char *serialport )
{

int fd;

struct termios termioptr;

/* open port and get all the attributes */
if( (fd=open(serialport,O_RDWR)) < 0){
	g_err(NOEXIT,PERROR,"Could not open serial port %s",serialport);
	return(-1);
}

else if(tcgetattr(fd,&termioptr)<0){
	g_err(NOEXIT,PERROR,"Get attributes failed on serial port %s",serialport);
	return(-1);
}

else{
	/* modify retrieved attributes */
	termioptr.c_iflag=0;  //break will be read as a 0, no signal, all other
			      //input processing turned off
	termioptr.c_oflag= 0; //no output processing,  send it raw
	termioptr.c_cflag=CS8|CREAD|CLOCAL; //8 bit/char, no modem control
	termioptr.c_lflag=0;	//no line protocol

	/*  the read will return :
	 *  after 128 characters
         *  OR after the number of chars requested in read sys call is avail
         *  OR after 1 * .1 secs has expired after last character
	 *
	 *  allows us to use 1 char I/O to read len then request more
	 *  and only use a single sys call which helps perf immensely
         */
	termioptr.c_cc[VMIN]=128; //read up to 128 but can ret on single char
	termioptr.c_cc[VTIME]=1;  //return after .1 sec intercharacter delay
}
/* set new attributes and return */
if(cfsetspeed(&termioptr,B115200) < 0){ 
	g_err(NOEXIT,PERROR,"Could not set speeds on serial port %s",serialport);
	return(-1);
}

else if(tcsetattr(fd,TCSAFLUSH,&termioptr)<0){
	g_err(NOEXIT,PERROR,"Set attributes failed on serial port %s",serialport);
	return(-1);
}

else{
	return(fd);
}

}

