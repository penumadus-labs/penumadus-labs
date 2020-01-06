#include <unistd.h>
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
#include <sys/time.h>
#include <signal.h>
#include <string.h>
#include <unistd.h>
#include <ctype.h>
#include "bool.h"
#include "stub.h"
#include "utils.h"

char *program_path();

/* routine to display errors */
int errfd=0;

void
g_err( char * errbuf, bool EXITSTAT, bool PERRNO)

{
char buf[1024];
long locerrno;
locerrno=errno;

	static char *logfile=GELCGIERR_FILE;

if(errfd==0){
    if((errfd=open(logfile,(O_SYNC|O_WRONLY|O_APPEND|O_CREAT),
		(S_IRWXU|S_IRWXG|S_IRWXO)) )<0){
	fprintf(stderr,"%05d %s COULD NOT OPEN FILE %s\n", getpid(),stamp(),GELCGIERR_FILE);
		exit(0);
    }
}


//sprintf(buf,"PID:%07d  errno:%d %s %s %s",getpid(),locerrno,stamp(),program_path(),errbuf);

	sprintf(buf,"PID:%07d %s %s",getpid(),stamp(),errbuf);

write(errfd,buf,strlen(buf));
if(PERRNO){
	sprintf(buf," -- %s\n", strerror(locerrno));
	write(errfd,buf,strlen(buf));
}
else{
	//write(errfd,"\n",1);
}


if(EXITSTAT)
	exit(0);

}


/* routine to timestamp an output */
unsigned char *
stamp(void)
{
time_t t;
struct tm *errtime;
static char buf[64];
t=time(NULL);
errtime=localtime(&t);
strftime(buf,sizeof(buf),"[%m/%d-%T]",errtime);
return((unsigned char *)buf);
}


#ifdef NEVER
/* used for debugging only */
static void
handler(int sig, siginfo_t *si, void *unused)
{
fprintf(stderr,"GOT SIGNAL %d - %s \n",si->si_signo,strsignal(si->si_signo));
fprintf(stderr,"errno %d  code%d \n",si->si_errno,si->si_code);
fprintf(stderr,"pid sender %ld  uid sender %ld \n",si->si_pid,si->si_uid);
fprintf(stderr,"file descriptor %ld  \n",si->si_fd);
exit(0);
}

void
catchsigs(void){
	struct sigaction sa;
	sa.sa_flags=SA_SIGINFO;
	sigemptyset(&sa.sa_mask);
	sa.sa_sigaction=handler;
	if(sigaction(SIGSEGV,&sa,NULL) == -1){
		fprintf(stderr,"sig handler failed\n");
		exit(0);
	}
	sigaction(SIGHUP, &sa,NULL);
	sigaction(SIGINT, &sa,NULL);
	sigaction(SIGQUIT, &sa,NULL);
	sigaction(SIGILL, &sa,NULL);
	sigaction(SIGABRT, &sa,NULL);
	sigaction(SIGFPE, &sa,NULL);
	sigaction(SIGKILL, &sa,NULL);
	sigaction(SIGSEGV, &sa,NULL);
	sigaction(SIGPIPE, &sa,NULL);
	sigaction(SIGALRM, &sa,NULL);
	sigaction(SIGTERM, &sa,NULL);
	sigaction(SIGUSR1, &sa,NULL);
	sigaction(SIGUSR2, &sa,NULL);
	sigaction(SIGCHLD, &sa,NULL);
	sigaction(SIGCONT, &sa,NULL);
	sigaction(SIGSTOP, &sa,NULL);
}

#endif


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


/* parse up a QUERY_STRING into arguments */
int
parseArgsHTML(struct queryargs_t *queryargs, int size_queryargs)
{

	char *cptr;
	int numargs;
	char *content;
	bool tagmode;
	static char buf[512];
	char lbuf[512];
	

	/* read URI data */
	if( (content=getenv("QUERY_STRING")) == NULL ){
		return(0);
	}
	sprintf(lbuf,"content: %s\n",content);
	g_err(lbuf,false,false);

	strncpy(buf,content,511);
	buf[511]='\0';
	cptr=buf;


	numargs=0;
	queryargs[numargs].tag=cptr;
	tagmode=true;
	while( numargs < size_queryargs ){

		//fprintf(stderr,"NUMARGS:%d %c\n",numargs,*cptr);

		switch( *cptr ){
			case '\0':
				dumpargs(queryargs,numargs);
				if(tagmode){
					queryargs[numargs].value=NULL;
				}
				numargs++;
				//fprintf(stderr,"numargs: %d\n",numargs);
				return(numargs);

			case '&':
				if(tagmode){
					queryargs[numargs].value=NULL;
				}
				*cptr++='\0';
				dumpargs(queryargs,numargs);
				numargs++;
				queryargs[numargs].tag=cptr;
				tagmode=true;
				break;

			case '=':
				if(!tagmode){
					//fprintf(stderr,"bad URL\n");
					g_err("\nPARSE ARGS: badly formed URL = in value\n",false,false);
					return(0);
				}
				else{
					*cptr++='\0';
					tagmode=false;
					queryargs[numargs].value=cptr;
				}
				break;

			default:
				cptr++;
		}
	}

	return(numargs);
}

void
dumpargs(struct queryargs_t *qptr,int numargs){
int i;
for(i=0;i<numargs;i++){
	fprintf(stderr,"%d: %s: %s\n",i,qptr->tag,qptr->value);
	qptr++;
}
}

/* prepend a string,  mostly for convenience in constructing error messages */
/* not real fast */
char *
prefunc(const char *first, char *dstr){
        static char *tstore=NULL;

        if(tstore != NULL){
                free(tstore);
        }


        if( (tstore=(char *)malloc(strlen(first)+strlen(dstr)+1)) == NULL){
                g_err("Malloc failed in prefunc\n",true,true);
                exit(0);
        }

        strcpy(tstore,first);
        strcat(tstore,dstr);
        return(tstore);
}


/* find the program name that is running me */
char *program_path()
{
    static char *path = NULL;
	int i;

    if(path == NULL){
	path=malloc(2048);
    }
    /* already gotten path once,  just return it */
    else
	return(path);


    if (path != NULL) {
        if (readlink("/proc/self/exe", path, 2048) == -1) {
            free(path);
            path[0] = '-';
            path[1] = '\0';
        }
    }
    else{
	fprintf(stderr,"malloc of path failed in g_err/program path\n");
	fflush(stderr);
	return(NULL);
   }
	*(path+2047)='\0';
	for(i=0;i<2048;i++){
		if( isascii(*(path+i)) == 0 ){
			*(path+i)='\0';
			break;
		}
	}
    return(path);
}
