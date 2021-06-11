#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netdb.h>
#include <netinet/in.h>
#include <arpa/inet.h>


struct seen {
	char ip[64];
	char mo[16];
	char day[16];
	char time[16];
	int port;
	int count;
	struct seen *fwdptr;
};

struct seen * searchentry(char *buf);
char * revlookup(char *ip);
void sortseen(void);
void printlist(void);

struct seen *doneseen=NULL;
int
main()
{


	char buf[2048];
	struct seen *dseen;
	FILE *fbuf;

	fbuf=stdin;
	//fbuf=fopen("data","r");

	while (fgets(buf,sizeof(buf),fbuf)){
		searchentry(buf);
	}


	sortseen();
	printf("%16s:%5s %6s %14s %24s\n","IP","PORT","COUNT","LASTEST DATE","NAME");
	for(dseen=doneseen;dseen != NULL; dseen=dseen->fwdptr){
		printf("%16s:%5d %6d %2s %2s %8s %s\n",
				dseen->ip,
				dseen->port,
				dseen->count,
				dseen->mo,
				dseen->day,
				dseen->time,
				revlookup(dseen->ip)
				);
	}
}


struct seen *
searchentry(char *buf){
	char  mo[16];
	char  day[16];
	char mytime [16];
	char ipaddr[64];
	int port;

	struct seen *tseen;
	struct seen *lseen;

	sscanf(buf,"%s %s %s %s %d",mo,day,mytime,ipaddr,&port);

	lseen=tseen=doneseen;

	for(tseen=doneseen;tseen!=NULL;tseen=tseen->fwdptr){
		if(strcmp(ipaddr,tseen->ip)==0){
			strcpy(tseen->mo,mo);
			strcpy(tseen->day,day);
			strcpy(tseen->time,mytime);
			tseen->count++;
			return(tseen);
		}
		else
			lseen=tseen;
	}


	//add entry
	tseen=malloc(sizeof(struct seen));
		
	strcpy(tseen->ip,ipaddr);
	strcpy(tseen->mo,day);
	strcpy(tseen->day,mo);
	strcpy(tseen->time,mytime);
	tseen->count=1;
	tseen->port=port;
	tseen->fwdptr=NULL;

	if(doneseen==NULL)
		doneseen=tseen;
	else
		lseen->fwdptr=tseen;

	return(tseen);
}


char *
revlookup(char *ip)
{
int retval;
struct sockaddr_in saGNI;
static char hostname[2048];
static char servInfo[2048];

    saGNI.sin_family = AF_INET;
    saGNI.sin_addr.s_addr = inet_addr(ip);
    saGNI.sin_port = htons(22);

    retval = getnameinfo((struct sockaddr*) & saGNI,
        sizeof(struct sockaddr),
        hostname,
        sizeof(hostname), servInfo, sizeof(servInfo), NI_NUMERICSERV);

    if (retval != 0) {
	strcpy(hostname,"Unknown");
	strcpy(servInfo,"Unknown");
    }
    return(hostname);
}


void
sortseen(void)
{

	int stopsort=0;
	struct seen *lastseen,*curseen, *nextseen;

	if(doneseen == NULL){
		printf("NULL LIST\n");
		return;
	}

	while(stopsort==0){
		int j;
		stopsort=1;
		lastseen=doneseen;
		j=0;
		for(curseen=doneseen;(j<10)&&(curseen != NULL) && (curseen->fwdptr!=NULL);
				curseen=curseen->fwdptr){
			//fprintf(stderr,"J:%d curseen:%p\n",j++,curseen);
			//printlist();
			//getchar();
			nextseen=curseen->fwdptr;
			if(curseen->count < nextseen->count){
				if(curseen== doneseen)
					doneseen=nextseen;
				else
					lastseen->fwdptr=nextseen;
				curseen->fwdptr=nextseen->fwdptr;
				nextseen->fwdptr=curseen;
				stopsort=0;
			}
			lastseen=curseen;
		}
	}
}

void
printlist(void)
{
	struct seen *dseen;
	int i;
	fprintf(stderr,"-----\n");
	for(i=0,dseen=doneseen;(i<30) && (dseen != NULL); dseen=dseen->fwdptr,i++){
		fprintf(stderr,"%d: %16s:%5d %6d %2s %2s %8s a:%p fwd:%p\n",
				i,
				dseen->ip,
				dseen->port,
				dseen->count,
				dseen->mo,
				dseen->day,
				dseen->time,
				dseen,
				dseen->fwdptr
				);
	}
}
