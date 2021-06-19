
/*
 * modify config parameters in this file (if necessary)
 * type "make" at command line to compile it
 * run "./testdata" to generate test samples to screen
 * run "./testdata -udp" to generate test sample to UDP port specified here as SENSE_OUTPORT
 */

#define CHG_PERCENT 10	//max amount in percent a value can randomly change up or down in one sample

#define BACKINTIME 6    //hrs to go back in time and start generating data
#define SAMPLEINTERVAL 60 	//number of seconds between generated sample data
/* BACKINTIME*SAMPLEINTERVAL is number of samples,  so in this case 6*60 or 360 samples */

#define SENSE_OUTADDR "127.0.0.1"	//send back to this server
#define SENSE_OUTPORT 32159		//directly to dtabase
