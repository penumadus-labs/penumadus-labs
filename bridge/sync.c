#include <unistd.h>     /* for close() */
#include <stdarg.h>     /* for close() */
#include <sys/types.h>
#include <stdio.h>      /* for printf() and fprintf() */
#include <stdlib.h>
#include <errno.h>
#include <sys/fcntl.h>
#include <sys/time.h>
#include <pthread.h>
#include <stdlib.h>     /* for atoi() and exit() */
#include <semaphore.h>
#include <sys/mman.h>
#include <string.h>     /* for memset() */
#include <sys/select.h>
#include <termios.h>
#include <utils.h>
#include <bool.h>
#include <netcomms.h>
#include <xbee.h>
#include <xbeeintfc.h>
#include <sync.h>

/* synchronization stuff */
pthread_mutex_t udplock;
pthread_mutex_t apilock;
struct sleeper createsocket_cond;
struct sleeper  bindsocket_cond;
struct sleeper  sendUDP_cond;

	
//setup mutex and condition variables

void
newCondVar(struct sleeper *ptr)
{
	static int num=0;
	pthread_mutexattr_t a;
	pthread_condattr_t b;
	pthread_mutexattr_init(&a);
	//pthread_mutexattr_setpshared(&a,PTHREAD_PROCESS_SHARED);
	pthread_condattr_init(&b);
	//pthread_condattr_setpshared(&b,PTHREAD_PROCESS_SHARED);
	pthread_mutex_init(&(ptr->data_mutex),&a);
	pthread_cond_init(&(ptr->data_avail),&b);
	ptr->statcode=0xFF;
	ptr->flag=false;
	ptr->id=num++;
}

int
newMutex(pthread_mutex_t *lock)
{
	if (pthread_mutex_init(lock, NULL) != 0) { 
		g_err(EXIT,PERROR,"\n mutex init has failed\n"); 
	} 
	return(0);
}

/* sleep on cond var  till something happens */
int 
sleep_on_status(struct sleeper *convar, unsigned long millisecs)
{
	char buf[256];
	int ret;
	struct timeval now;
        struct timespec timeout;
	unsigned long microsecs;


	gettimeofday(&now,NULL);
	timeout.tv_sec = now.tv_sec + (unsigned long)(millisecs/1000);
	microsecs= (millisecs%1000)*1000;
	timeout.tv_nsec = (now.tv_usec+microsecs) * 1000;

	/* lock the condition variable */
	if(pthread_mutex_lock(&(convar->data_mutex))!=0){
		g_err(NOEXIT,PERROR,"%s: id=%d Could not lock mutex\n",
			__FUNCTION__,convar->id);
		return(-1);
	}

	/* make sure status hasn't changed before we sleep */
	if(convar->flag == false){
		/* unlock mutex (automatic) and wait on cond var */
		//fprintf(stderr,"Sleeping...\n");
		ret=pthread_cond_timedwait(&(convar->data_avail),
			&(convar->data_mutex), &timeout);
	}

	convar->flag=false;
		
	/* unlock condition var again as relocked in cond wait */
	if(pthread_mutex_unlock(&(convar->data_mutex))!=0){
		g_err(EXIT,PERROR,"Could not unlock mutex\n");
	}

	if(ret==0){
		//fprintf(stderr,"normal exit from sleep\n");
	}
	else if(ret==ETIMEDOUT){
		g_err(NOEXIT,NOPERROR,"utils: Timeout on sleep\n");
	}
	else if(ret == EINTR){
		g_err(NOEXIT,PERROR,"cond timedwait error EINTR %d\n",ret);
	}

	return(ret);
}



/* routine to kick the condition variable */
/* to wake up all the consumer processes cause something happened  */
void
kickstatus(struct sleeper *convar)
{
        /* this call blocks till mutex available */
        if(pthread_mutex_lock(&(convar->data_mutex))!=0){
                g_err(EXIT,PERROR,"could not lock mutex\n");
        }
        /* set the flag to let know stat changed */
        convar->flag=true;
        pthread_cond_broadcast(&(convar->data_avail));
        if(pthread_mutex_unlock(&(convar->data_mutex))!=0){
                g_err(EXIT,PERROR,"could not unlock mutex\n");
        }
}

