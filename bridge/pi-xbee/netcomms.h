//Memory Allocation
#define FRAMESIZE 256		//max frame to send via udp
#define MAXFRAMEBUF 2*FRAMESIZE  //frame size for xbee protocol which is udp + overhead so dbl it
#define CHARBURST 5	//# of chars to wait on if no work, or 100mS timer


//Protocol TIMERS and TIMEOUTS
#define SENDUDP_TIMEOUT 6000   	//time to wait on UDP packet frame clearance  
				// if it is sent asynchronously, expect checkrecvframe
				// to handle it. All operations in mS
#define LINKCHECKINTERVAL 10 //how often wifipi checks that link is up and
			   //recovers link if down
			   //then informs hank.  
			   //PONDSCUM this is an interruption
			   //to hank so eventually should only be updated
			   //when there is more than 5 seconds between hank
			   //traffic anyway

#define RECOVERYINTERVAL 4	//how often to check for cell service if lost

/* internal states while reading data */
#define RESTART -2
#define BADCHECKSUM -3

//XBEE command definitions that we use
#define APIMODE2		//1 is simple, 2 is escaped characters 
				//so no false start/stops  
				//uses byte-stuffing

/* requests */
#define ATCMND  	0x08	//cmnd AT cmnd requests 
#define APITXREQ  	0x20	//api mode transmit request 

/* responses */
#define APITXREQRESP  	0x89	//api mode transmit request status response
#define ATCMNDRESP  	0x88	//frame id for response from get cell status
#define MODEMSTATUS  	0x8a	//unsolicited frame from modem with status when connected
#define SOCKCREATERESP  0xC0	//unsolicited frame from modem with status when connected
#define RECVDATA  	0xB0	//received data on a socket opened by transmit

#define SOCKCREATE	0x40
#define SOCKCREATERESP	0xC0
#define SOCKBIND	0x46
#define SOCKBINDRESP	0xC6
#define SOCKRECVFROM	0xCE
#define SOCKSENDTO	0x45



//XBEE serial link Frame structure
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
#define SETUPID 	0x40	//setup frames
#define CELLSTATID 	0x70	//frame id used to get cell status
#define FRAMEDATAID 	0xa0	//frame ids for UDP send commands
#define SNEAKYFRAME 	0x90	//sneaky untracked UDP frames which are not tracked
				//with timeouts and may be sent while another command
				//is pending.  normally hank is one at a time

