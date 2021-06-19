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
#include <sys/stat.h>
#include <signal.h>
#include <unistd.h>
#include <ctype.h>
#include <libgen.h>
#include <bool.h>
#include <utils.h>


int errfd=0;
int logfileseed=0;

/* routine to display errors */
void
g_err( EXITSTAT exitstat, PRINTERR printerr, char *fmt, ... )
{

char buf[ERRBUFSZ];
char obuf[2*ERRBUFSZ];
long locerrno;
int n;

	locerrno=errno;


	//open a unique log file for ever program using this utility
	static char *logfile=NULL;

	if(logfile == NULL){
		char *tptr;
		strcpy(buf,program_path());
		//basename may modify buf so don't pass it program_path()
		tptr=basename(buf);
		//allocate a buffer for the path plus an extra / and a \0 and an E_
		logfile=malloc(strlen(LOGPATH) + strlen(tptr) + 16 + 5);
		strcpy(logfile,LOGPATH);
		strcat(logfile,"/e_");
		strcat(logfile,tptr);
		strcat(logfile,".log");
		sprintf(obuf,"%05d",logfileseed);
		strcat(logfile,obuf);
		printf("logfile is %s\n",logfile);
		//so stdout becomes the logfile as well
		//so printfs work when not using console.
		//to strip debug just put errfd=1 in the first of main
		if(errfd==0){ 
			close(1);
		}
		else{
			printf("ignoring logfile,  using file desc %d\n",
				errfd);
			setvbuf(stdout,NULL,_IOLBF,0);
			setvbuf(stderr,NULL,_IOLBF,0);
		}
	}


	/* errfd=0,  need to open the logfile */
	if(errfd==0){
		/* getrid of old logfile */
		unlink(logfile);
		if((errfd=open(logfile,(O_SYNC|O_WRONLY|O_APPEND|O_CREAT),
		    (S_IRWXU|S_IRWXG|S_IRWXO)) )<0){
			fprintf(stderr,"%05d %s COULD NOT OPEN FILE %s\n", 
			getpid(),stamp(),logfile);
			exit(1);
	    	}

		/* so printfs show up in file where they belong */
		/* need to chang line buffer mode */
		setvbuf(stdout,NULL,_IOLBF,0);
		setvbuf(stderr,NULL,_IOLBF,0);
	}

	/* was an extra string passed? */
	if(fmt != NULL){
		/* get the variadic user string */
		va_list locargs;
		va_start(locargs, fmt);
		vsprintf(buf,fmt,locargs);
		va_end(locargs);
		n=sprintf(obuf,"%s %s ",stamp(),buf);
		//n=sprintf(obuf,"%s PID:%07d %s ",stamp(),getpid(),buf);
	}
	else
		n=sprintf(obuf,"%s PID:%07d ",stamp(),getpid());


	if(printerr == PERROR){
		n+=sprintf(buf,"\n                 errno: %s\n", strerror(locerrno));
		strcat(obuf,buf);
	}
	else{
#ifdef PONDSCUM
		if(isatty(errfd) == 0){
			strcat(obuf,"\n\r");
			n++;
			n++;
		}
		else{
#endif
		{
			strcat(obuf,"\n");
			n++;
		}
			
	}

	write(errfd,obuf,n);

	if(exitstat == EXIT)
		exit(0);

}


/* routine to timestamp an output */
unsigned char *
stamp(void)
{
time_t t;
struct tm *errtime;
static unsigned char buf[64];
t=time(NULL);
errtime=localtime(&t);
strftime(buf,sizeof(buf),"[%m/%d-%T]",errtime);
return(buf);
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
                g_err(EXIT,PERROR,"%s","Malloc failed in prefunc\n");
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

/* start a process with variable arguments */
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

			g_err(NOEXIT,NOPERROR,buf);
			execvp(command,argv);
			g_err(EXIT,PERROR,"Exec error on %s",command);
			exit(1);
			
		case -1:
			g_err(NOEXIT,PERROR,"fork error writeProc code");
			return(-1);
			break;

		default:
			break;
	}

return(pid);
}


/* open bare iron buffer  mem */

volatile unsigned char *
init_devmem(long mymaplen, long myoffset){

	int mem_fd;
	void *mem_map;


   /* open /dev/mem */
   if ((mem_fd = open("/dev/mem", O_RDWR|O_SYNC) ) < 0) {
   //if ((mem_fd = open("/dev/fmem", O_RDWR|O_SYNC) ) < 0) {
      g_err(EXIT,PERROR,"can't open /dev/mem");
   }

/*if want alignment checks */
// Truncate offset to a multiple of the page size, or mmap will fail.
    //size_t pagesize = sysconf(_SC_PAGE_SIZE);
    //off_t page_base = (myoffset / pagesize) * pagesize;
    //off_t page_offset = myoffset - page_base;
//fprintf(stderr,"mymaplen %lx  pagebase %lx\n",mymaplen,page_base);
	//insert the following as substitute parameters in mmap for len and offset
      //mymaplen+page_offset,       //Map length
      //page_base         //Offset to mem to base of mem buf in bare metal

   /* mmap location to copy from */
   mem_map = mmap(
      NULL,             //Any adddress in our space will do
	mymaplen,
      PROT_READ|PROT_WRITE,// Enable reading & writting to mapped memory
      MAP_SHARED,       //Shared with other processes
      mem_fd,           //File to map
      myoffset         //Offset to mem to base of mem buf in bare metal
   );


   if (mem_map == MAP_FAILED) {
	g_err(EXIT,PERROR,"mmap error %p - errno %d", mem_map,errno);
   }

   close(mem_fd); //No need to keep mem_fd open after mmap

   // Always use volatile pointer!
   
	return((volatile unsigned char *)mem_map);

}



/* create pid file so never have more than one 
 * UDPengine on same port at one time 
 */

void
lockfiles (unsigned short hankPort )
{
	struct stat statme;
	char lockfile[2048];
	int tempfd;
	char buf[256];
	int n;
	int assasinID;
	int killcount;


	sprintf(lockfile,"%s",LOCKPATH);
	//may fail if exists, ok,  otherwise an error
	if(mkdir(lockfile,S_IRWXU|S_IRWXG|S_IRWXO)<0){
		if(errno != EEXIST){
			fprintf(stderr,"%s: could not make lock directory %s\n",
					__FUNCTION__,lockfile);
			exit(1);
		}
	}

	sprintf(lockfile,"%s/%d.lock",LOCKPATH,hankPort);
	/* lockfile exists */
	killcount=0;
	while(stat(lockfile,&statme) == 0){
		if((tempfd=open(lockfile,O_RDONLY)) < 0){
			fprintf(stderr, "%s: Could not open existing lockfile %s\n",
				__FUNCTION__,
				lockfile);
		}
		else if( (n=read(tempfd,buf,sizeof(buf)) ) < 0){
			fprintf(stderr, "%s: Could not read existing lockfile %s\n",
				__FUNCTION__,
				lockfile);
		}
		else{
			close(tempfd);
			sscanf(buf,"%d",&assasinID);
			if(kill(assasinID,SIGUSR1) != 0){
				//process is dead already
				if(errno ==ESRCH)
					break;
				else{
					fprintf(stderr, "%s: Could not send signal to proc %d\n",
						__FUNCTION__,
						assasinID);
					exit(1);
				}
			}
		}
		if(killcount++ > KILLMAX){
			fprintf(stderr, "%s: Killcount exceeded\n", __FUNCTION__);
			exit(1);
		}
		else{
			fprintf(stderr,"Waiting for proc %d to exit\n",assasinID);
			sleep(1);
		}
	}//end while
	
	//if here old process should have exited and cleaned up its lock file
	//now create a new one
	
	sprintf(buf,"%d",getpid());
	if((tempfd=open(lockfile,O_WRONLY|O_CREAT|O_TRUNC,0666)) < 0){
		fprintf(stderr, "%s: Could not open new lockfile %s\n",
			__FUNCTION__,
			lockfile);
		exit(1);
	}
	else if( (n=write(tempfd,buf,strlen(buf)) ) < 0){
		fprintf(stderr, "%s: Could not write to new lockfile %s\n",
			__FUNCTION__,
			lockfile);
		exit(1);
	}
	else{
		close(tempfd);
	}

}//end func

bool
unlockfiles (unsigned short hankPort )
{
	char lockfile[2048];
	sprintf(lockfile,"%s/%d.lock",LOCKPATH,hankPort);
	if(unlink(lockfile) <0 ){
		g_err(NOEXIT,PERROR,"%s: Could not unlock file %s\n",
			__FUNCTION__,
			lockfile);
		return(false);
	}
	else{
		g_err(NOEXIT,NOPERROR,"%s: Removed unlock file %s\n",
			__FUNCTION__,
			lockfile);
		return(true);
	}
}
