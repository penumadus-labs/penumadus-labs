
/* setup the port*/

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

struct termios savetermio;
int fd;
int flags;

void
restoretty(){

if(tcsetattr(fd,TCSAFLUSH,&savetermio)<0){
	g_err(NOEXIT,PERROR,"Set attributes failed on tty");
}
if(fcntl(fd,F_SETFL, flags)){
	g_err(NOEXIT,PERROR,"could not set blocking");
}
}

int
portsetup( char *serialport )
{


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

else if(tcgetattr(fd,&savetermio)<0){
	g_err(NOEXIT,PERROR,"Get attributes failed on serial port %s",serialport);
	return(-1);
}
else{
	/* modify retrieved attributes */
	termioptr.c_lflag &= ~ICANON;
	termioptr.c_lflag &= ~ECHO;
	termioptr.c_cc[VMIN]=1; //read up to 128 but can ret on single char
	termioptr.c_cc[VTIME]=0;  //return after .1 sec intercharacter delay
}

if(tcsetattr(fd,TCSAFLUSH,&termioptr)<0){
	g_err(NOEXIT,PERROR,"Set attributes failed on serial port %s",serialport);
	return(-1);
}


if((flags=fcntl(fd,F_GETFL,0))<0){
	g_err(NOEXIT,PERROR,"could not get");
	return(-1);
}
//else if(fcntl(fd,F_SETFL, flags|O_NONBLOCK)){
	//g_err(NOEXIT,PERROR,"could not set");
	//return(-1);
//}

else
	return(fd);

}

