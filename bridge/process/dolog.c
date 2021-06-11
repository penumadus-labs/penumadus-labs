#include <stdio.h>
#include <stdlib.h>
#include <time.h>


double
epochtoexcel(long secs, long usecs)
{
	double a;
	secs = secs-(3600.0*5);
	a=((secs+(usecs/1000000.0)) /86400.0)+25569.0;
	
	return( a );
}

int main()
{

char buf[2048];
float deflect;
unsigned long secs;
unsigned long usecs;

while( gets(buf) != NULL ){
	sscanf(buf,"%f %lx %lx",&deflect,&secs,&usecs);
	printf("%lf,%f\n", epochtoexcel(secs,usecs), deflect);
}
}

