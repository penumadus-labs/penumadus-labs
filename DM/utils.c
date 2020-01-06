/* Cryptic Utility programs to support error printing and starting any helper processess */

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <errno.h>
#include <termios.h>
#include <string.h>
#include <pthread.h>
#include <semaphore.h>
#include <sys/mman.h>
#include <time.h>
#include <signal.h>
#include <string.h>
#include <unistd.h>
#include <bool.h>

#define SENSE_ERR_FILE "/home/ubuntu/DM/DM.log"

unsigned char errbuf[256];
char * stamp(void);

/* routine to timestamp and display output or errors  */
/* errbuf is string to print
*  if EXITSTAT is true program ends 
*  if PERRNO is true the system error string is also printed
*/
int errfd=0;
void
g_err( char * errbuf, bool EXITSTAT, bool PERRNO)

{
char buf[1024];


if(errfd==0){
    if((errfd=open(SENSE_ERR_FILE,(O_SYNC|O_WRONLY|O_APPEND|O_CREAT),
		(S_IRWXU|S_IRWXG|S_IRWXO)) )<0){
	fprintf(stderr,"%05d %s COULD NOT OPEN FILE %s", getpid(),stamp(),SENSE_ERR_FILE);
		exit(0);
    }
}


sprintf(buf,"%07d PID %s %s",getpid(),stamp(),errbuf);
write(errfd,buf,strlen(buf));
if(PERRNO){
	sprintf(buf," -- %s\n", strerror(errno));
	write(errfd,buf,strlen(buf));
}

if(EXITSTAT)
	exit(0);

}

/* routine to timestamp an output */
char *
stamp(void)
{
time_t t;
struct tm *errtime;
static char buf[64];
t=time(NULL);
errtime=localtime(&t);
strftime(buf,sizeof(buf),"[%m/%d-%T]",errtime);
return(buf);
}


pid_t
startproc(char *command, int num,...)
{
	pid_t pid;
	char buf[256];
	char *argv[40];
	int i;

	va_list args;
	va_start(args,num);

	argv[0]=command;
	for(i=1;i<=num;i++){
		argv[i]=va_arg(args,char *);
	}
	va_end(args);
	argv[i]=(char *)NULL;

	switch(pid = fork()){
		case 0:
			sprintf(buf,"Bout to exec %s",command);
			for(i=1;i<=num;i++){
				strcat(buf," ");
				strcat(buf,argv[i]);
			}
			strcat(buf,"\n");

			g_err(buf,false,false);
			execvp(command,argv);
			sprintf(buf,"Exec error on %s errno is %d-%s\n",command,errno,
				strerror(errno));
			g_err(buf,true,true);
			exit(1);
			
		case -1:
			g_err("fork error in cgi code \n",false,true);
			return(-1);
			break;

		default:
			break;
	}

return(pid);
}

