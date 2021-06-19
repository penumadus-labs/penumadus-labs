#include <sys/types.h>
#include <stdio.h>      /* for printf() and fprintf() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <errno.h>
#include <sys/fcntl.h>
#include <sys/time.h>
#include <pthread.h>
#include <sys/socket.h> /* for socket() and bind() */
#include <arpa/inet.h>  /* for sockaddr_in and inet_ntoa() */
#include <semaphore.h>
#include <sys/mman.h>
#include <string.h>     /* for memset() */
#include <unistd.h>     /* for close() */
#include <math.h>     /* for close() */
#include <sys/select.h>
#include <bool.h>
#include <utils.h>
#include <netcomms.h>
#include <protocol.h>
#include <servercomms.h>
#include <parse.h>

#define LOCBUFSIZE 256	//loc buffer size for service routines
bool hankCommand(unsigned char *command, int cmndsize, const char *requestor);
extern char deviceID[];

/* command routines for database requests */
/* DB-> hank */
bool settime(unsigned char *request);
bool myshutdown(unsigned char *request);
bool commitparams(unsigned char *request);
bool erasesd(unsigned char *request);
bool setip(unsigned char *request);
bool getip(unsigned char *request);
bool getpress(unsigned char *request);
bool setpress(unsigned char *request);
bool getsample(unsigned char *request);
bool setsample(unsigned char *request);
bool getaccel(unsigned char *request);
bool setaccel(unsigned char *request);
bool setdevice(unsigned char *request);
bool getdevice(unsigned char *request);
bool settime(unsigned char *request);
bool resetdevice(unsigned char *request);

/* response routines hank->DB */
bool respGeneric(unsigned char *incoming, unsigned char *outgoing, int outgoingsize, parsetbl_t *parseptr);
bool respPressParams(unsigned char *incoming, unsigned char *outgoing, int outgoingsize, parsetbl_t *parseptr);
bool respAccelParams(unsigned char *incoming, unsigned char *outgoing, int outgoingsize, parsetbl_t *parseptr);
bool respSampParams(unsigned char *incoming, unsigned char *outgoing, int outgoingsize, parsetbl_t *parseptr);
bool respDevName(unsigned char *incoming, unsigned char *outgoing, int outgoingsize, parsetbl_t *parseptr);
bool respShutdown(unsigned char *response, unsigned char *outgoing, int outgoingsize, parsetbl_t *parseptr);
bool respGetip(unsigned char *response, unsigned char *outgoing, int outgoingsize, parsetbl_t *parseptr);
bool unk(unsigned char *response, unsigned char *outgoing, int outgoingsize, parsetbl_t *parseptr);

#define LOCUNC unsigned char *

parsetbl_t parsetbl[] = {
/* DB FUNC	   UDP cmnd func  UDP resp func	 HANK CODE  HANK SUBCODE */
{"TIME",            settime,       respGeneric,	    RESYNCTIME,       0},
{"SHUTDOWN",        myshutdown,    respShutdown,    SHUTDOWN,         0},
{"COMMITPARAMS",    commitparams,  respGeneric,     COMMITPARAMS,     0},
{"ERASESD",         erasesd,       respGeneric,     ERASESD,          0},
{"SETIP",           setip,         respGeneric,     SETIPPARAMS,      0},
{"GETIP",           getip,         respGetip,       GETIPPARAMS,      0},
{"RESETDEVICE",     resetdevice,   respGeneric,     RESETHANK,        0},
{"GETPRESS",        getpress,      respPressParams, GETPARAMS,    GP_PRESSPARAMS},
{"SETPRESS",        setpress,      respGeneric,     SETPARAMS,    GP_PRESSPARAMS},
{"GETSAMPLEPARAMS", getsample,     respSampParams,  GETPARAMS,    GP_SAMPLEPARAMS},
{"SETSAMPLEPARAMS", setsample,     respGeneric,     SETPARAMS,    GP_SAMPLEPARAMS},
{"GETACCELPARAMS",  getaccel,      respAccelParams, GETPARAMS,    GP_ACCELPARAMS},
{"SETACCELPARAMS",  setaccel,      respGeneric,     SETPARAMS,    GP_ACCELPARAMS},
{"SETDEVICENAME",   setdevice,     respGeneric,     SETPARAMS,    GP_DEVICEIDPARAM},
{"GETDEVICENAME",   getdevice,     respDevName,     GETPARAMS,    GP_DEVICEIDPARAM},
{NULL,     NULL,     NULL,   0,             0}
};
    

/************************ DB->HANK ******************/
bool 
settime(unsigned char *request){
	char locbuf[LOCBUFSIZE];
	int n;

	struct timeval tv;

	if(gettimeofday(&tv,NULL) < 0){
		g_err(NOEXIT,PERROR,"get time for sync failed");
	}

	/* get the current time and echo back to sender */
	n=sprintf(locbuf,RESYNCFORMAT,
		RESYNCTIME,
		(unsigned long)tv.tv_sec,
		(unsigned long)tv.tv_usec);
        hankCommand(locbuf,n,__FUNCTION__);
	g_err(NOEXIT,NOPERROR,"UDP->hank ** SYNCED TIME ****");
	return(true);
}

bool 
myshutdown(unsigned char *request){
	
    hankCommand(SHUTDOWNFMT,sizeof(SHUTDOWNFMT)-1,__FUNCTION__);
    return(true);
}


bool 
commitparams(unsigned char *request){
	char locbuf[LOCBUFSIZE];
	int n;
	g_err(NOEXIT,NOPERROR,"ENTERED: %s",__FUNCTION__);
	n=sprintf(locbuf,"%c",COMMITPARAMS);
        hankCommand(locbuf,n,__FUNCTION__);
	return(true);
}
bool 
erasesd(unsigned char *request){
	char locbuf[LOCBUFSIZE];
	int n;
	g_err(NOEXIT,NOPERROR,"ENTERED: %s",__FUNCTION__);
	n=sprintf(locbuf,"%c",ERASESD);
        hankCommand(locbuf,n,__FUNCTION__);
        return(true);
}
bool 
resetdevice(unsigned char *request){
	char locbuf[LOCBUFSIZE];
	int n;
	g_err(NOEXIT,NOPERROR,"ENTERED: %s",__FUNCTION__);
	n=sprintf(locbuf,"%c",RESETHANK);
        hankCommand(locbuf,n,__FUNCTION__);
        return(true);
}
bool 
setip(unsigned char *request){
        char locbuf[LOCBUFSIZE];
	int n;
	unsigned short port;
	char ipaddr[32];
	sscanf(request,"%s %hd",ipaddr,&port);
	n=sprintf(locbuf,SETIPFMT,SETIPPARAMS,ipaddr,port);
        hankCommand(locbuf,n,__FUNCTION__);
        return(true);
}

bool 
getip(unsigned char *request){
        char locbuf[LOCBUFSIZE];
	int n;
	n=sprintf(locbuf,GETIPFMT,GETIPPARAMS);
        hankCommand(locbuf,n,__FUNCTION__);
        return(true);
}

bool 
getpress(unsigned char *request){
    char locbuf[LOCBUFSIZE];
    int n;
    n=sprintf(locbuf,GP_CMNDHDR,GETPARAMS,GP_PRESSPARAMS);
    hankCommand(locbuf,n,__FUNCTION__);
    return(true);
}

bool 
setpress(unsigned char *request){
    char locbuf[LOCBUFSIZE];
    int n;
    int psiPreFill,psiPostFill,fills,fillMax;
	float fullScale,excitation,calibration;
	int nfs,nex,ncl;

    sscanf(request,GP_PRESSPARAMSFMT_FLOAT,
		&psiPreFill,
		&psiPostFill,
		&fills,
		&fillMax,
		&fullScale,
		&excitation,
		&calibration);

	//add .5 and cast to int to round
    nfs=(int)(fullScale*GP_PRESSPARAMSFMT_SCALEINT+.5);
    nex=(int)(excitation*GP_PRESSPARAMSFMT_SCALEINT+.5);
    ncl=(int)(calibration*GP_PRESSPARAMSFMT_SCALEINT+.5);

    n=sprintf(locbuf,GP_CMNDHDR GP_PRESSPARAMSFMT_SR,
		SETPARAMS,
		GP_PRESSPARAMS,
		psiPreFill,
		psiPostFill,
		fills,
		fillMax,
		nfs,
		nex,
		ncl);
    hankCommand(locbuf,n,__FUNCTION__);
    return(true);
}

bool 
getsample(unsigned char *request){
    char locbuf[LOCBUFSIZE];
    int n;
    n=sprintf(locbuf,GP_CMNDHDR,GETPARAMS,GP_SAMPLEPARAMS);
    hankCommand(locbuf,n,__FUNCTION__);
    return(true);
}
bool 
setsample(unsigned char *request){
    char locbuf[64];
    int n;
    int secBetween,sampleinterval,accelsamp;
    sscanf(request,GP_SAMPLEPARAMSFMT_SR,&secBetween,&sampleinterval,&accelsamp);
    n=sprintf(locbuf,GP_CMNDHDR GP_SAMPLEPARAMSFMT_SR,
		SETPARAMS,GP_SAMPLEPARAMS,secBetween,sampleinterval,accelsamp);
    hankCommand(locbuf,n,__FUNCTION__);
    return(true);
}
bool 
getaccel(unsigned char *request){
    char locbuf[LOCBUFSIZE];
    int n;
    n=sprintf(locbuf,GP_CMNDHDR,GETPARAMS,GP_ACCELPARAMS);
    hankCommand(locbuf,n,__FUNCTION__);
    return(true);
}
bool 
setaccel(unsigned char *request){
    char locbuf[LOCBUFSIZE];
    int n;
    float mag;
    int nmag;
    sscanf(request,GP_ACCELPARAMSFMT_FLOAT,&mag);
    nmag=(int)(mag*GP_ACCELPARAMSFMT_SCALEINT+.5);
    n=sprintf(locbuf,GP_CMNDHDR GP_ACCELPARAMSFMT_SR,
		SETPARAMS,GP_ACCELPARAMS,nmag);
    hankCommand(locbuf,n,__FUNCTION__);
    return(true);
}

bool 
setdevice(unsigned char *request){
        char locbuf[LOCBUFSIZE];
	int n;
	char newname[21];
	sscanf(request,GP_DEVICEIDPARAMSFMT_SR,newname);
	n=sprintf(locbuf,GP_CMNDHDR GP_DEVICEIDPARAMSFMT_SR,
			SETPARAMS,
			GP_DEVICEIDPARAM,
			newname);
        hankCommand(locbuf,n,__FUNCTION__);
        return(true);
}

bool 
getdevice(unsigned char *request){
        char locbuf[LOCBUFSIZE];
	int n;
	n=sprintf(locbuf,GP_CMNDHDR,GETPARAMS,GP_DEVICEIDPARAM);
        hankCommand(locbuf,n,__FUNCTION__);
        return(true);
}


/***************** response routines ***************/
/***************** HANK->DB ***************/

bool
respGeneric(unsigned char *incoming,unsigned char *outgoing,int outgoingsize,parsetbl_t *parseptr)
{
	char *resp;
	int n;
	g_err(NOEXIT,NOPERROR,"RESP %s:%s",__FUNCTION__,incoming);
	if(*incoming=='A')
		resp="ACK";
	else
		resp="NACK";

	if((n=snprintf(outgoing,outgoingsize,
		"{\"type\":\"%s\","
		  "\"id\":\"%s\","
		  "\"status\":\"%s\","
		  "\"time\":\"%lu.0\","
		 "\"pad\":\"",
			parseptr->request,//start of args
			deviceID,
			resp,
			time(NULL)
		)) >= outgoingsize)
			g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
		else
			outgoing[n]=PADCHAR;//get rid of null term in json

	//return true for outgoing db traffic
	return(true);
}


//incoming responses from hank on GETSAMP request
bool
respSampParams(unsigned char *incoming,unsigned char *outgoing,int outgoingsize, parsetbl_t *parseptr)
{
	int secBetween,sampleinterval,accelsampint;
	int n;

	sscanf(incoming, GP_SAMPLEPARAMSFMT_SR, 
		&secBetween,
		&sampleinterval,
		&accelsampint
		);

	if((n=snprintf(outgoing,outgoingsize,
		"{\"type\":\"%s\","
		  "\"id\":\"%s\","
		  "\"secBetween\":\"%d\","
		  "\"sampleinterval\":\"%d\","
		  "\"accelsampint\":\"%d\","
		  "\"time\":\"%lu.0\","
		 "\"pad\":\"",
			parseptr->request,	//start of args
			deviceID,
			secBetween,
			sampleinterval,
			accelsampint,
			time(NULL)
		)) >= outgoingsize)
			g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
		else
			outgoing[n]=PADCHAR;//get rid of null term in json

	//return true for outgoing db traffic
	return(true);
}


//incoming responses from hank on GETPRESS request
bool
respPressParams(unsigned char *incoming,unsigned char *outgoing,int outgoingsize,parsetbl_t *parseptr)
{
	int psiPreFill,psiPostFill,fills,fillMax;
	int fullScale,calFactor,excitation;
	int n;
	g_err(NOEXIT,NOPERROR,"RESP %s:%s",__FUNCTION__,incoming);
	sscanf(incoming, GP_PRESSPARAMSFMT_SR, 
		&psiPreFill,
		&psiPostFill,
		&fills,
		&fillMax,
		&fullScale,
		&excitation,
		&calFactor
		);

	if((n=snprintf(outgoing,outgoingsize,
		"{\"type\":\"%s\","
		  "\"id\":\"%s\","
		  "\"psiPreFill\":\"%d\","
		  "\"psiPostFill\":\"%d\","
		  "\"fills\":\"%d\","
		  "\"fillMax\":\"%d\","
		  "\"fullscale\":\"%.2f\","
		  "\"excitation\":\"%.2f\","
		  "\"calFactor\":\"%.2f\","
		  "\"time\":\"%lu.0\","
		 "\"pad\":\"",
			parseptr->request,	//start of args
			deviceID,
			psiPreFill,
			psiPostFill,
			fills,
			fillMax,
			fullScale/GP_PRESSPARAMSFMT_SCALEINT,
			excitation/GP_PRESSPARAMSFMT_SCALEINT,
			calFactor/GP_PRESSPARAMSFMT_SCALEINT,
			time(NULL)
		)) >= outgoingsize)
			g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
		else
			outgoing[n]=PADCHAR;//get rid of null term in json

	//return true for outgoing db traffic
	return(true);
}

//incoming responses from hank on GETACCELMAG request
bool
respAccelParams(unsigned char *incoming,unsigned char *outgoing,int outgoingsize,parsetbl_t *parseptr)
{
	float mag;
	int nmag;
	int n;

	g_err(NOEXIT,NOPERROR,"RESP %s:%s",__FUNCTION__,incoming);
	sscanf(incoming, GP_ACCELPARAMSFMT_SR, 
		&nmag
		);
	mag=nmag/GP_ACCELPARAMSFMT_SCALEINT;

	if((n=snprintf(outgoing,outgoingsize,
		"{\"type\":\"%s\","
		  "\"id\":\"%s\","
		  "\"accelmagthresh\":\"%f\","
		  "\"time\":\"%lu.0\","
		 "\"pad\":\"",
			parseptr->request,	//start of args
			deviceID,
			mag,
			time(NULL)
		)) >= outgoingsize)
			g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
		else
			outgoing[n]=PADCHAR;//get rid of null term in json

	//return true for outgoing db traffic
	return(true);
}

//incoming responses from hank on GETPRESS request
bool
respGetip(unsigned char *incoming,unsigned char *outgoing,int outgoingsize,parsetbl_t *parseptr)
{
	int n;
	char ipaddr[32];
	unsigned short ipport;

	g_err(NOEXIT,NOPERROR,"RESP %s:%s",__FUNCTION__,incoming);
	sscanf(incoming, GETIPFMT_SR, 
		ipaddr,
		&ipport
		);

	if((n=snprintf(outgoing,outgoingsize,
		"{\"type\":\"%s\","
		  "\"id\":\"%s\","
		  "\"ipaddr\":\"%s\","
		  "\"ipport\":\"%hd\","
		  "\"time\":\"%lu.0\","
		 "\"pad\":\"",
			parseptr->request,	//start of args
			deviceID,
			ipaddr,
			ipport,
			time(NULL)
		)) >= outgoingsize)
			g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
		else
			outgoing[n]=PADCHAR;//get rid of null term in json

	//return true for outgoing db traffic
	return(true);
}

//incoming responses from hank on GETPRESS request
bool
respDevName(unsigned char *incoming,unsigned char *outgoing,int outgoingsize,parsetbl_t *parseptr)
{
	int n;
	char locname[32];

	g_err(NOEXIT,NOPERROR,"RESP %s:%s",__FUNCTION__,incoming);
	sscanf(incoming, GP_DEVICEIDPARAMSFMT_SR, 
		locname
		);

	strcpy(deviceID,locname);

	if((n=snprintf(outgoing,outgoingsize,
		"{\"type\":\"%s\","
		  "\"id\":\"%s\","
		  "\"deviceid\":\"%s\","
		  "\"time\":\"%lu.0\","
		 "\"pad\":\"",
			"GETDEVICENAME",	//start of args
			deviceID,
			locname,
			time(NULL)
		)) >= outgoingsize)
			g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
		else
			outgoing[n]=PADCHAR;//get rid of null term in json

	//return true for outgoing db traffic
	return(true);
}
//incoming responses from hank on shutdown
bool
respShutdown(unsigned char *response,unsigned char *outgoing,int outgoingsize,parsetbl_t *parseptr)
{
	int n;
	g_err(NOEXIT,NOPERROR,"RESP %s:%s",__FUNCTION__,response);
	if((n=snprintf(outgoing,outgoingsize,
		"{\"type\":\"%s\","
		  "\"id\":\"%s\","
		  "\"SHUTDOWN\":\"Awaiting PowerDown\","
		  "\"time\":\"%lu.%06lu\","
		 "\"pad\":\"",
		parseptr->request,	//start of args
		  deviceID,
		time(NULL),
		(long)0 
	)) >= outgoingsize)
		g_err(NOEXIT,NOPERROR,"OUTPUT TRUNCATION! %d",n);
	else
		outgoing[n]=PADCHAR;//get rid of null term in json
	return(true);
}
bool
unk(unsigned char *response,unsigned char *outgoing,int outgoingsize,parsetbl_t *parseptr)
{

g_err(NOEXIT,NOPERROR,"Unknown %s %s",parseptr->request,response);
}
