//Memory Allocation
#define FRAMESIZE 80		//fixed sized frame to send via udp
#define MAXBUFSIZE 2*FRAMESIZE  //frame size for xbee protocol which is udp + overhead so dbl it


//Protocol TIMERS and TIMEOUTS
#define LOC_SOCKTIMEOUT 3000   	//if waiting on a frame synchronously, 
				//(waitforframe called)
				// this is time to wait till error and abandon
#define SENDUDP_TIMEOUT 6000   	//time to wait on UDP packet frame clearance  
				// if it is sent asynchronously, expect checkrecvframe
				// to handle it. All operations in mS
#define LINKCHECKINTERVAL 5 //how often wifipi checks that link is up and
			   //recovers link if down
			   //then informs hank.  
			   //PONDSCUM this is an interruption
			   //to hank so eventually should only be updated
			   //when there is more than 5 seconds between hank
			   //traffic anyway

#define RECOVERYINTERVAL 4000	//how often to check for cell service if lost
#define TIMESYNCINTERVAL 1000	//how often poll for time from server 



//XBEE command definitions that we use
#define APIMODE2		//1 is simple, 2 is escaped characters 
				//so no false start/stops  
				//uses byte-stuffing

#define ATCMND  	0x08	//cmnd AT cmnd requests 
#define APITXREQ  	0x20	//api mode transmit request 
#define APITXREQRESP  	0x89	//api mode transmit request status response
#define ATCMNDRESP  	0x88	//frame id for response from get cell status
#define MODEMSTATUS  	0x8a	//unsolicited frame from modem with status when connected
#define SOCKCREATERESP  0xC0	//unsolicited frame from modem with status when connected
#define RECVDATA  	0xB0	//received data on a socket opened by transmit
//extension to xbee set for wifi
#define WIFICMND	0xD0	//special commands for WIFI ops begin with 0xD0
#define WIFI_RET_ERR    0x42
#define WIFI_SUCCESS    0x00	//same as for cell success


//XBEE and WIFI serial link Frame structure
/* offsets in frames to find these items */
#define DELIMITER 0
#define LENHI 1
#define LENLO 2
#define FRAMETYPE 3
#define FRAMEID 4
#define FRAMEDATA 4

//tracking structure using frame ids so when received asynchronously
//we know how to order, parse, or timeout  frames.
/* arbitrary frame number definitions */
#define CELLSTATID 	0x70	//frame id used to get cell status
#define FRAMEDATAID 	0xa0	//frame ids for UDP send commands
#define SNEAKYFRAME 	0x90	//sneaky untracked UDP frames which are not tracked
				//with timeouts and may be sent while another command
				//is pending.  normally hank is one at a time

