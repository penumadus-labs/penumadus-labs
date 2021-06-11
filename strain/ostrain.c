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
#include <sys/signal.h>
#include <sys/time.h>
#include <utils.h>
#include <bool.h>
#include <strain.h>

extern int errfd;	//used in utils.c to determine error output
int setupListener(unsigned short port);
void killspace (char *tmpbuf);	//kill spaces in csv
char * mymaketime(time_t time);

/* MAIN startup, then become the net sender thead */
int 
main(int argc, char *argv[])
{
	char tmpbuf[BIGBUF+2]; //random buffer
	char outbuf[BIGBUF+2]; //output buffer
	int ret;		//used for return codes from sys calls
	int recvMsgSize;
	unsigned short locport;
	int remSock;
	struct sockaddr_in RemoteIP; /* IP address struct for incoming message */
	socklen_t len;
	int journal_fd;		//journal file to log all messages 
	bool ipfirstflag=true;

	//stuff for syncing esp time to real time
	struct timeval synctime;
        unsigned long basemillis=0;
        unsigned long millis,lastmillis;
        bool timesynced=false;
        unsigned long secs, usecs;

	struct indata {
		float millivolts;
		float excitation;
		float offset;
		float temp;
		float humidity;
	}report; 

	struct calibdata {
		struct indata c_report;
		unsigned long secs;
		unsigned long usecs;
		bool updated;
		bool init;
		char updateflg;
		float escale;
	}calib;

	char rtype;

	//variables for calculating strain
	float Vr;
	float K;
	float GF;
	float RG;
	float R3;
	float e;
	float esim;

	unsigned short port=INPORT;

	/* for debug only */
	//errfd=1;

	g_err(NOEXIT,NOPERROR,"Initializing...\n");

	calib.updated=false;
	calib.init=false;

	/* start the journal */
	if((journal_fd=open(JOURNALFILE,O_RDWR|O_APPEND|O_CREAT,0644)) < 0){
		g_err(EXIT,PERROR,"Could not open journal file %s",JOURNALFILE);
	}


	locport=INPORT;
	len=sizeof(RemoteIP);

	remSock=setupListener(port);

	while(true){
		if ((recvMsgSize = recvfrom(remSock, tmpbuf, BIGBUF,
                        0, (struct sockaddr *) &RemoteIP, &len)) < 0){
                            g_err(NOEXIT,PERROR,"**ERR:recvfrom() on %d failed",locport);
			sleep(5);
			continue;
                }

	        tmpbuf[recvMsgSize]='\0';
		if(ipfirstflag){
			ipfirstflag=false;
			g_err(NOEXIT,NOPERROR,"Recv From Remote %s:%d [%s]\n",
				 inet_ntoa(RemoteIP.sin_addr),locport,tmpbuf);
		}

		//printf("tmpbuf:[%s]\n",tmpbuf);
		//remove the stupid spaces
		killspace(tmpbuf);

		//get common parameters and type
		sscanf(tmpbuf,"%lu,%c", &millis, &rtype);

		//the esps have no sense of clock time so have to interpolate here
                if(!timesynced || (millis <= lastmillis)){
                        basemillis=millis;
                        gettimeofday(&synctime,NULL);
                        timesynced=true;
                }
                lastmillis=millis;

                //get millis passed since time recorded
                millis-=basemillis;

                //adjust seconds and microsecs by number of millis since basemillis
                secs=synctime.tv_sec+(millis/1000);

                usecs=synctime.tv_usec+((millis%1000)*1000);
                if(usecs >= 1000000){
                        usecs-= 1000000;
                        secs++;
                }


		switch (rtype){
			case 'C':
				calib.secs = secs;
				calib.usecs = usecs;
				//millis and type superflous here
				sscanf(tmpbuf,"%lu,%c,%f,%f,%f",
						&millis,
						&rtype,
						&calib.c_report.millivolts,
						&calib.c_report.excitation,
						&calib.c_report.offset
				);
				if(!calib.init){
					len=snprintf(outbuf,sizeof(outbuf),
					"date,time,decimal time (secs.ms),mV,Excite,offset,calib updated?,calib time(s.ms),calib mV, calib excite, calib offset,strains uncorrected,corrected\n");
					calib.init=true;
					write(journal_fd,outbuf,len);
				}
				calib.updated=true;

				//RYAN - where calibration factor gets set
				Vr=calib.c_report.millivolts/calib.c_report.excitation;
				//Vr=1.0/report.excitation;
				K=390.0/(390.0+390.0);
				GF=2.0;
				RG=350.0;
				R3=350.0;


				//general equation for unbalanced legs
				//e=R3-(2*RG*(Vr+K));
				//e= e/ (GF*RG*(Vr+K));

				//if leg resistances equal use below
				e=(-4*Vr)/(GF*(1+2*Vr));

				//eqn5 in tn514 vishay
				esim=(RG)/(GF*(RG+100000.0));
				calib.escale = e/esim;

				//END MATH

				printf("\nesim: %f e: %f calib: %f\n\n",esim,e,calib.escale);
				printf("%8s %10s %8s %8s %10s %8s %14s %14s\n",
					"sample",
					"sample",
					"sample",
					"calib",
					"calib",
					"calib",
					"uncorrected",
					"corrected"
				);
				printf("%8s %10s %8s %8s %10s %8s %14s %14s\n",
					"mV",
					"excite",
					"offset",
					"mV",
					"exc",
					"off",
					"u-strain",
					"u-strain"
				);
				printf("--------------------------------------------------------------------------------------\n");

				break;

			case 'D':
				if(!calib.init)
					break;
				if(calib.updated){
					calib.updateflg='C';
					calib.updated=false;
				}
				else
					calib.updateflg='-';
		
				//convert string to values
				sscanf(tmpbuf,"%lu,%c,%f,%f,%f",
						&millis,
						&rtype,
						&report.millivolts,
						&report.excitation,
						&report.offset
				);


				//RYAN where data MATH occurs

				Vr=report.millivolts/report.excitation;
				//Vr=1.0/report.excitation;
				K=390.0/(390.0+390.0);
				GF=2.0;
				RG=350.0;
				R3=350.0;

				//general equation for unbalanced legs
				//e=R3-(2*RG*(Vr+K));
				//e= e/ (GF*RG*(Vr+K));

				//if leg resistances equal use below
				e=(-4*Vr)/(GF*(1+2*Vr));

				//RYAN END MATH

				len=snprintf(outbuf,sizeof(outbuf),
					"%s,%ld.%06ld,%.4f,%.4f,%.4f,"
					"%c,%ld.%06ld,%.4f,%.4f,%.4f,%.4f,%.4f\n",
						mymaketime(secs),
						secs,
						usecs,
						report.millivolts,
						report.excitation,
						report.offset,
						calib.updateflg,
						calib.secs,
						calib.usecs,
						calib.c_report.millivolts,
						calib.c_report.excitation,
						calib.c_report.offset,
						e*1000000.0,
						e*calib.escale*1000000.0
				);
				write(journal_fd,outbuf,len);
				len=snprintf(outbuf,sizeof(outbuf),
					"%8.2f %10.4f %8.2f "
					"%8.2f %10.4f %8.2f %14.4f %14.4f\n",
						report.millivolts,
						report.excitation,
						report.offset,
						calib.c_report.millivolts,
						calib.c_report.excitation,
						calib.c_report.offset,
						e*1000000.0,
						e*calib.escale*1000000.0
				);
				write(1,outbuf,len);
				break;
			default:
				g_err(NOEXIT,NOPERROR,"Invalid Report Type %c\n",rtype);
		}

	}
}




/* open and bind a listener on a socket */
int 
setupListener(unsigned short port)
{
    int sock;
    struct sockaddr_in LocalIP;  /* local bind to address */
    /* Create socket for sending/receiving datagrams */
    if ((sock = socket(PF_INET, SOCK_DGRAM , IPPROTO_UDP)) < 0){
                g_err(EXIT,PERROR,"%s: socket() call failed",__FUNCTION__);
        }

    /* Construct local address structure */

    /* Zero out structure */
    memset(&LocalIP, 0, sizeof(LocalIP));

    /* Internet address family */
    LocalIP.sin_family = AF_INET;

    /* Any incoming interface (in case of multiple 
    network cards like wireless and ether) */
    LocalIP.sin_addr.s_addr = htonl(INADDR_ANY);
    LocalIP.sin_port = htons(port);      /* Local port */


    /* Got a socket, now Bind to the local address and port */
    if (bind(sock, (struct sockaddr *) &LocalIP, sizeof(LocalIP)) < 0){
        g_err(EXIT,PERROR,"%s: bind() call failed",__FUNCTION__);
    }

    return(sock);
}

void
killspace (char *tmpbuf)
{
	char *cptr, *aptr;
	cptr=aptr=tmpbuf;

	while(*cptr != '\0'){
		while(*cptr==' ')
			cptr++;
		*aptr++ = *cptr++;
	}
	*aptr='\0';
}


char *
mymaketime(time_t time){

	struct tm *mytm;
	static char mytime[64];
	
	mytm=gmtime(&time);
	
	snprintf(mytime,64,"%02d/%02d/%02d,%02d:%02d:%02d",
		mytm->tm_mon+1,
		mytm->tm_mday,
		mytm->tm_year+1900-2000,
		mytm->tm_hour,
		mytm->tm_min,
		mytm->tm_sec
	);
	return(mytime);
}

