
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/time.h>
#include <errno.h>

int
main(int argc,char *argv[])
{

struct timeval tv;
struct timespec ts;
unsigned long  long millis;;
time_t a;

sscanf(argv[1],"%llu",&millis);

ts.tv_sec=tv.tv_sec=millis/1000;
tv.tv_usec=(millis%1000)*1000;
ts.tv_nsec=tv.tv_usec*1000;


a=time(NULL);
printf("<H1>Current Time on Server %s UTC<br></H1>",ctime(&a));
printf("<H1>Settng time to %s UTC<br></H1>",ctime(&tv.tv_sec));
if(clock_settime(CLOCK_REALTIME,&ts) < 0){
	printf("<H1>Failed to set time-%s<br></H1>",strerror(errno));
}
else{
	printf("<H1>Time Synced!<br></H1>");
}
fflush(stdout);
exit(0);

}
