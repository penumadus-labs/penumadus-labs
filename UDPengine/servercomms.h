#define SENSE_OUTADDR "127.0.0.1"  //address of database/control
//#define SENSE_OUTADDR "18.220.179.7"	//this is the echo server for at arboretum monitor for testing


#define MAXPENDING  5		//max open dbase connections,  currently forced to 1
				//by software
#define CLIENTWAITSECS 10  	//no activity timeout before warning
#define DBASECHKINT	10	//how often in seconds to check if dbase is back online


#define MAXSIZE 2*MAXBUFSIZE 	//length of UDP message is FRAMESIZE,
				//  MAXBUFSIZE is 2*this,  (usually 2*80=160)
				//this is for internal buffers to accomodate
				//parsing etc

//JSON is so wordy,  make DBPACKETSIZE  128 for safety
//and use this internlly
#define DBPACKETSIZE 200		//packetsize for UDP->DBASE
#define DBFRAMESIZE  DBPACKETSIZE	//packetsize for DBASE->UDPENGINE
					//used to be 80 to fit in hank brain
#define PADCHAR ' '	//character to pad out packets with

#ifdef JUSTCOMMENTS

/* DB FUNC	   UDP cmnd func  UDP resp func	 HANK CODE  HANK SUBCODE */
{"TIME",            settime,       respGeneric,	            RESYNCTIME,        0},
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



HANK->DBASE

ACCELERATION:
	{ "id":"%s",
	  "loc":"%s",
	  "mag:":%.2f,
	  "x":%.2f,
	  "y":%.2f,
	  "z":%.2f,
	  "stamp":%lld,
	  "pad":"vvv"  }

REG DATA:
	{ "id":"%s",
	  "loc":"%s",
	  "pres:":%f,
	  "fills":%d,
	  "temp":%d,
	  "hum":%d,
	  "stamp":%lld, 
	  "pad":"vvv"  }

LOG DATA: 

	{ "log:":"%s",
	  "stamp":%lld, 
	  "pad":"vvv"  }


DBASE->HANK COMMANDS:

NOTE:  all the SETS and GETS here deal only with the current operating parameters.
       after a shutdown hank will forget them unless a COMMIT TO SD is executed
       sometime before powerdown.

SET TIME:
	syncs time to server time
        Request: TIME (pad to 200)
       *Response: TIME id status etc

SHUTDOWN:   - clean shutdown of SD card and data stuck there
        Request: SHUTDOWN (pad to 200)
       *Response: { SHUTDOWN id status etc
		Response continues once every 5 seconds till power removed

COMMIT TO SD:  - warning,  this command entails reset of hank
        Request: COMMITPARAMS pad:vvv (pad to 200)
       *Response: { "CMND":"COMMITPARAMS",
		   "STATUS":"ACK or NACK"
		   "pad":"vvv" (pad to 256)
		 }

ERASE SD DATA - erases any buffered data on SD not yet sent to database
        Request: ERASESD pad:vvv (pad to 200)
       *Response: { "CMND":"ERASESD",
		   "STATUS":"ACK or NACK"
		   "pad":"vvv" (pad to 256)
		 }


SET IP PARAMETERS:
        Request: SETIP ipaddr port(16) (pad to 200)
       *Response: SETIP status id ack

GET IP PARAMETERS:
        Request: GETIP (pad to 200)
       *Response: { "CMND":"GETIP",
		   "ip":"%s",
		   "port":"%s"
		   "pad":"vvv" (pad to 256)
		 }

GET PRESSURE PARAMS:
        Request: GETPRESS ipaddr port(16) (pad to 200)
       Response: { "CMND":"GETPRESS",
			"psiPreFill":%d,
			"psiPostFill":%d,
			"fill":%d,
			"fillMax":%d,
			"fullScale":%f,
			"excitation":%f,
			"calFactor":%f,
		        "pad":"vvv" (pad to 256)
		 }

SET PRESSURE PARAMS:
       Request: SETPRESS psiPreFill(%d) psiPostFill(%d) fill(%d) fillMax(%d) fullScale(%f) excitation(%f) calFactor(%f) pad:vvv (pad to 200)
       *Response: { "CMND":"GETPRESS",
		   "STATUS":"ACK or NACK"
		   "pad":"vvv" (pad to 256)
		 }
		
	

GET SAMPLE PARAMS:
        Request: GETSAMPLEPARAMS (pad to 200)
       Response: { "CMND":"GETSAMPLE",
			"secBetween":%d,
			"sampleinterval":%d,
			"accelsampint":%d,
		        "pad":"vvv" (pad to 256)
		 }

SET SAMPLE PARAMS:
       Request: SETSAMPLEPARAMS secBetween(%d) sampleinterval(%d) accelsampint(%d) pad:vvv (pad to 200)
       Response: { "CMND":"GETSAMPLEPARAMS",
		   "STATUS":"ACK or NACK"
		   "pad":"vvv" (pad to 256)
		 }
		
GET ACCEL PARAMS:
        Request: GETACCELPARAMS (pad to 200)
       Response: { "CMND":"GETACCELPARAMS",
			"mag":%f,
		        "pad":"vvv" (pad to 256)
		 }

SET ACCEL PARAMS:
       Request: SETACCELPARAMS mag(%f) pad:vvv (pad to 200)
       Response: { "CMND":"SETACCELPARAMS",
		   "STATUS":"ACK or NACK"
		   "pad":"vvv" (pad to 256)
		 }
		
#endif
