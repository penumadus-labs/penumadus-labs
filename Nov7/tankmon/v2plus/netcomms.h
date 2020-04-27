#define FRAMESIZE 80		//fixed sized frame to send via udp
#define MAXBUFSIZE 2*FRAMESIZE  //frame size for xbee protocol which is udp + overhead so dbl it
#define APIMODE2		//1 is simple, 2 is escaped characters so no false start/stops  
				//uses byte-stuffing

#define LOC_SOCKTIMEOUT 3000   //time to wait on socket operatons in mS
#define SENDUDP_TIMEOUT 6000   //time to wait on UDP packet frame clearance  operatons in mS
				//this should be shorter than 

#define SETUPFRAMES 	0x20	//frame id used to get cell status
#define CELLSTATID 	0x70	//frame id used to get cell status
#define FRAMEDATAID 	0xa0	//frame ids for UDP send commands
#define SNEAKYFRAME 	0x90	//sneaky untracked UDP frames spit out between timers
#define TIMESYNCID 	0x40	//sneaky untracked UDP frames spit out between timers

#define ATCMND  	0x08	//cmnd AT cmnd requests 
#define APITXREQ  	0x20	//api mode transmit request 
#define APITXREQRESP  	0x89	//api mode transmit request status response
#define ATCMNDRESP  	0x88	//frame id for response from get cell status
#define MODEMSTATUS  	0x8a	//unsolicited frame from modem with status when connected
#define SOCKCREATERESP  	0xC0	//unsolicited frame from modem with status when connected
#define RECVDATA  	0xB0	//received data on a socket opened by transmit

#define BADSOCK 	0xFA	//an impossible socket value

#define DELIMITER 0
#define LENHI 1
#define LENLO 2
#define FRAMETYPE 3
#define FRAMEID 4
#define FRAMEDATA 4

#define RECOVERYINTERVAL 1000	//how often to check for cell service if lost
