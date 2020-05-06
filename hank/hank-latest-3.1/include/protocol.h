
//PROTOCOL DEFINITION

/*Global Parameters
  Every msg in socket to database is HSOCKETLEN bytes long
  Rationale: 
  1. We need to know how much to read from socket and
     the overhead in system calls to get len and reread
     with associated possibility of blocking and losing control
     when handling variable length data packets is usually greater
     than overhead of properly moving a few extra bytes in user space.
     This number should be tuned to just a couple bytes larger than largest
     Expected command/response
  
  2. Small len single writes in linux are guaranteed to be atomic at the process level
     so multiple writers on socket won't scramble command.
  
  3. Handling the message fragmentation problem on variable length messages introduces
     a lot of opportunity for coding errors and is easily added 
     to stable software in future if requred.
  
  4. We are communicating with multiple different unknown environments (nodejs, c, ....)
     so options like SOCK_SEQPACKET on the socket creation which are elegant albeit little
     known solutions to this problem are not available to us as they are incompatible with
     existing "web based" applicaton software stacks
*/


/*PROTOCOL:
   Things headed downstream need to be terse for poor little hanks slow 
   baby brain and tiny memory.  
   Upstream on the server can be wordy.

   **(ABANDONED) arduino restrictions force jumptables into RAM which we have little of so
     this is done with a simple switch which stays in FLASH.  don't go down this road again
   On Downstream,  the commandbyte actually represents an offset into a jump 
   table down on hank to streamline parsing so keeping this file
   in sync is CRITICAL.  
  
   while a string based protocol would fix this linkage,
   hank doesn't even have the memory left over to store the string much less the horsepower
   to parse it and still get samples out.  
   In addition,  comms to hank are serial in current hardware.  each character takes us
   .2 mS to transmit/process.  When trying to hit a 5mS data sample rate,  just processing a
   a 10 character packet will use up 2mS of our 5mS window.  keep it terse. hank is predominantly
   an outgoing box. 
  
   hank max rate:                           5 KB/sec
   internet average rate:              20,000 KB/sec 
   server internal TCP/sock rate: 64,000,0000 KB/sec (measured on rpi)
   so if we can scarifice server time and complexity 
   to save hank time,  lets push processing up.
  
   **UPDATE got rid of pads to speed things up.  UDP holds packet boundaries for us
   no pad anymore
*/


/*IMPORTANT GLOBAL NOTE:
    all things heading to hank arrive with a prefix byte of WIFICMND (0xD0) or RECVDATA (0xB0)
    if they are from wifipi direct they have WIFICMND,  if they are pass through from UDPengine
    they have RECVDATA.   this is xbee serial protocol dictated

    following are sentences to be used transparent to prefix byte which is stripped by
    xbee or parser on hank
*/

//arduino doesn't support floating point printf so have
//to use this goofy macro and %ld.%02ld to make it work.
#define FAKEFLOAT(X) (int)X,((int)((X)*100))%100

#define ACK 'A'
#define NACK 'N'

/************ HANK TALKING TO UDPengine on server ***********/
//upstream protocol type indicators
#define CMND 	  'C'	//this is a command/reponse string
#define RESPONSE  'R'	//this is a response to a command 
#define ACCELDATA 'A'	//this is accelerometer data
#define MAINDATA  'D'	//this is pres/temp/humid etc data
#define LOG       'L'	//this is a log request  string

//protocol prototypes
//MAIN DATA
/*	msgtype(D)
	deviceID,
	pressure.pressure, 
	fills,
	temp,
	hum,
	secs,	//timestamp
	usecs,	//timestamp
	msgnum 
*/
#define MAINDATAFMT "%c %s %s %d.%02d %d %d %d %lx %lx %x" 

//ACCELDATA
/* 	msgtype(A),
	deviceID,
	accelx.x,
	accely.y,
	accelz.z,
	secs,	//timestamp
	usecs,	//timestamp
	msgnum  
*/
#define ACCELFMT "%c %s %s %d.%02d %d.%02d %d.%02d %lx %lx %x"


//LOGDATA  -limited to 12 characters 
//   which are included as part of string not parsed
/*	msgtype(L),
	log string,
*/
#define LOGREQ	"%c %s"	




/****************  WIFIPI TALKING DIRECT TO UDPengine ***********/
//this one is special as response received by wifipi, not hank,
//even though it may be sent by hank or wifipi
//if no wifi, hank gets and processes response as a recv'd response (xbee format 0xB0)
//UDP engine doesn't know the difference
/*	msgtype(C)
*	"WIFIQUERY"
* 
* Response: 	'U'
* 		"UP!"
*/
#define WIFIQUERYFMT "%c %s" 
//string to be sent to UDP server as a QUERY to see if WIFI is UP
#define WIFIQUERYSTRING "C WIFIQUERY"	 
//expected downstream response
#define WIFIQUERYRESP "U UP!"	 //what UDPserver should return



/***********   WIFIPI TALKING TO HANK  ******************/
//some special cmnds/responses are needed outside of UDPengine to Hank
//these begin with 0xD0 to 0xDF, a range unused by the xbee protocol
//following are sub-commands of the 
//special commands for WIFI ops begin with 0xD0
//remember regular hank commands from UDP start with RECVDATA which is 0xB0 in xbee talk
//only WIFI->HANK direct use this prefix byte
//#define WIFICMND	0xD0	//from above

//subcommands
//tell hank wifi is up
#define WIFIBOOTED 	'B'
/* frame format WIFI->HANK
 *	WIFICMND WIFIBOOTED
 *
 * frame response format
 *	NONE
 */

#define WIFIAVAIL 	'A'
/* frame format WIFI->HANK
 *	WIFICMND WIFIAVAIL
 *
 * frame response format
 *	NONE
 */
#define WIFIDOWN 	'D'
/* frame format WIFI->HANK
 *	WIFICMND WIFIDOWN
 *
 * frame response format
 *	NONE
 */

/******************************************************************/
/***   NORMAL SOCKET COMMANDS FROM EXTERNAL PROGRAMS TO UDPengine *****/
/* trigger following frames to/from HANK */
/* UDP->hank */

//

//SUMMARY OF CODES USED BELOW
//#define SHUTDOWN 	'H'
//#define ERASESD 	'E'
//#define RESETHANK     'Q'	//this is a reset/quit request
//#define RESYNCTIME 	'T'	//defined above
//#define SETIPPARAMS 	'P'   //defined above
//#define GETIPPARAMS 	'p'
//#define GETPARAMS 	'G'
//#define SETPARAMS 	's'
//#define COMMITPARAMS	'Z'
	//  PARAMCODES 
	// #define GP_PRESSPARAMS		'P'
	// #define GP_ACCELPARAMS		'A'
	// #define GP_DEVICEIDPARAM		'D'
	// #define GP_SAMPLEPARAMS		'S'
//
 

/* generic response and command headers */
//RESPONSE COMMANDCODE ACK/NACK
#define GEN_RESP_FMT  "%c %c %c"
/* generic subcodeed response and command headers */
//RESPONSE COMMANDCODE SUBCODE ACK/NACK
#define GEN_GPRESP_FMT  "%c %c %c %c"



/* request from hank to resync time with server*/
/*      msgtype(C),
*	"TIME?"
*/
#define TIMESYNCREQSTRING "C TIME?" //request to UDP to sync time
/*	
*  response from UDPserver engine:   
*/
#define RESYNCTIME 	'T'	//defined above
/* frame request format
 *	RESYNCTIME seconds useconds
 *
 * frame response format
 *	RESPONSE RESYNCTIME ack/nack
 *	uses GEN_RESP_FMT
 */
#define RESYNCFORMAT_SR "%lx %lx"
#define RESYNCFORMAT "%c %lx %lx"

/* sets hanks IP address and port */
#define SETIPPARAMS 	'P'   
/* frame request format
 *	SETIPPARAM ipaddr port
 *
 * frame response format
 *	RESPONSE SETIPPARAM ack/nack
 *	uses GEN_RESP_FMT
 */
#define SETIPFMT  "%c %s %hd"

/* gets hanks IP address and port */
#define GETIPPARAMS 	'p'
/* frame request format
 *	GETIPPARAMS
 *
 * frame response format
 *	RESPONSE GETIPPARAMS ipaddr port
 */
#define GETIPFMT  "%c"
#define GETIPFMT_R  "%c %c " GETIPFMT_SR
#define GETIPFMT_SR  "%s %hd"

/* shutdown hank and close SD files */
#define SHUTDOWN 	'H'
/* frame request format
 *	SHUTDOWN
 *
 * frame response format
 *	RESPONSE SHUTDOWN  continuously till turned off
 *	uses GEN_RESP_FMT
 */
//all constants, for this one,  keep it simple 
#define SHUTDOWNFMT_PROTO  "%c"
#define SHUTDOWNFMT  "H"
#define SHUTDOWNFMT_SR "%c"

/* commits parameters in memory to SD card*/
/* WARNING, this causes a reset of hank */
#define COMMITPARAMS		'Z'
/* frame request format
 *      COMMITPARAMS
 * frame response format
 *	uses GEN_RESP_FMT
 *	None
 */
//all constants, for this one,  keep it simple 
#define COMMIT_PROTO  "%c"


/* erases old data on SD card */
/* WARNING, this causes a reset of hank */
#define ERASESD 'E'
/* frame request format
 *      ERASESD
 * frame response format
 *	RESPONSE ERASESD ACK/NACK
 *	uses GEN_RESP_FMT
 */
//all constants, for this one,  keep it simple 


/* erases old data on SD card */
/* WARNING, this causes a reset of hank */
#define RESETHANK     'Q'	//this is a reset/quit request
/* frame request format
 *      RESETHANK
 * frame response format
 *	RESPONSE RESETHANK ACK/NACK
 *	uses GEN_RESP_FMT
 */
//all constants, for this one,  keep it simple 

/* get and set hank parameters */
#define GETPARAMS 	'G'
#define SETPARAMS 	's'
/* frame request format
 *	GETPARAMS PARAMCODE 
 *
 * frame response format
 *	RESPONSE GETPARAMS PARAMCODE PARAMVALUES
 */
/* frame request format
 *	SETPARAMS PARAMCODE PARAMVALUES
 *
 * frame response format
 *	RESPONSE SETPARAMS PARAMCODE "ACK"
 */
/* PARAMCODES */
#define GP_PRESSPARAMS		'P'
#define GP_ACCELPARAMS		'A'
#define GP_DEVICEIDPARAM	'D'
#define GP_SAMPLEPARAMS		'S'

#define GP_CMNDHDR "%c %c "
#define GP_RESPHDR "%c %c %c "


#define DIRECT_RESPHDR "%c "


/* sets/gets hanks pressure measurement parameters */
/* frame request format
 *      GETPARAMS GP_PRESSPARAMS 
 *	SETPARAMS GP_PRESSPARAMS psiPreFill psiPostFill fills fillMax fullScale excitation calFactor 
 *
 * frame response format
 *	RESPONSE GETPARAMS GP_PRESSPARAMS psiPreFill psiPostFill fill fillMax fullScale excitation calFactor
 *	RESPONSE SETPARAMS GP_PRESSPARAMS [A or N] (ACK/NACK)
 *	uses GEN_GPRESP_FMT
 *
 */
#define GP_PRESSPARAMSFMT_FLOAT	"%d %d %d %d %f %f %f" //not scaled int
#define GP_PRESSPARAMSFMT_SR	"%d %d %d %d %d %d %d" //scaled int
#define GP_PRESSPARAMSFMT_R	GP_RESPHDR  GP_PRESSPARAMSFMT_SR
#define GP_PRESSPARAMSFMT_SCALEINT 100.0


/* sets/gets hanks sample intervals */
/* frame request format
 *      GETPARAMS GP_SAMPLEPARAMS 
 *	SETPARAMS GP_SAMPLEPARAMS secBetween sampleinterval accelsampint 
 *
 * frame response format
 *	RESPONSE GETPARAMS GP_SAMPLEPARAMS secBetween sampleinterval accelsampint 
 *	RESPONSE SETPARAMS GP_SAMPLEPARAMS [A or N] (ACK/NACK)
 *	uses GEN_GPRESP_FMT
 *
 */
#define GP_SAMPLEPARAMSFMT_SR	"%d %d %d"
#define GP_SAMPLEPARAMSFMT_R	GP_RESPHDR GP_SAMPLEPARAMSFMT_SR

/* sets/gets hanks maxg*/
/* frame request format
 *      GETPARAMS GP_ACCELPARAMS 
 *	SETPARAMS GP_ACCELPARAMS maxg
 *
 * frame response format
 *	RESPONSE GETPARAMS GP_ACCELPARAMS maxg
 *	RESPONSE SETPARAMS GP_ACCELPARAMS [A or N] (ACK/NACK)
 *
 */
#define GP_ACCELPARAMSFMT_FLOAT	"%f"	//FLOAT version
#define GP_ACCELPARAMSFMT_SR	"%d"	//this is a scaled int (mul/div 100)
#define GP_ACCELPARAMSFMT_SCALEINT 100.0
#define GP_ACCELPARAMSFMT_R	GP_RESPHDR  GP_ACCELPARAMSFMT_SR


/* sets/gets hanks device Id */
/* frame request format
 *      GETPARAMS GP_DEVICEIDPARAMS 
 *	SETPARAMS GP_DEVICEIDPARAMS deviceId 
 *
 * frame response format
 *	RESPONSE GETPARAMS GP_DEVICEIDPARAMS deviceId 
 *	RESPONSE SETPARAMS GP_DEVICEIDPARAMS [A or N] (ACK/NACK)
 *	uses GEN_GPRESP_FMT
 *
 *	ID CAN ONLY BE 20 characters!!!!!
 */
#define GP_DEVICEIDPARAMSFMT_SR	"%s"
#define GP_DEVICEIDPARAMSFMT_R	GP_RESPHDR + GP_DEVICEPARAMSFMT_SR 

