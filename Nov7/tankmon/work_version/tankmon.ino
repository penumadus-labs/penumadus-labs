#include "hdw.h" 
#include "calib.h" 
#include <EEPROM.h>
#include <IniFile.h>
#include <IPAddress.h>
#include <SPI.h>
#include <SD.h>
#include <Protocentral_ADS1220.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include "netcomms.h" 

/* The at2650 talks to an xbee in API 2  mode using virtual frames over serial connect 
 * Frame IDs are used to identify the packet types by convention here
 * 0x20-0x29 are setup frames 
 * 0xa0-0xa9 are normal data xmit frames
 * 0x70-0x79 are used to poll for cell status
 * 0x90-0x99 are used for sneaky packets
 */

/*
 * sendUDP or sendUDPsneaky send udp encapsulated in the xbee protocol to be stripped and sent.
 * checkReceivedFrames looks at returned frames from xbee and updates status variables
 * the main loop is mostly timers that go off and cause various data to be send.
 * the first of the main loop checks that the cell connection is still active and tries to
 * recover if it disappears as the result of an checkReceivedFrames  status saying its lost.
 */

/*
 * Everything has an error timer,  even inter-character receives so this code should never hang.
 * most recover is a full reset though there is some attempt to recover the cell modem if signal
 * is lost due to the amount of timer required for a full reset
 */


bool err0 = false;	//flags to indicate err has been tripped
bool err1 = false;	//so can blink LEDs

unsigned int packetstotal=0;	//counter for total packets 
unsigned int packetslost=0;	//counter for lost packets

unsigned long  networktime=0;	//network time from server

unsigned char socketid=BADSOCK; //socket id to talk to xbee
unsigned char packetpending=0;  //frame id of any sendUDP outstanding, 0 means none
bool cell_avail=false;		//false till cell signal detected by xbee

/* implementation of local microsecond and millisecond timers 
 * call setLocalTimer with the timerid, interval, and MILLISECS or MICROSECS 
 * then poll that timer with timerExpired periodically to check it 
 */
#define PACKETTIMEOUT 0
#define TRIGGERTIME 1
#define INITTIMER 2
#define WAITTIME 3
#define LOCSOCKTIMER 4
#define CHARSTART 5
#define TRIGGERSERVER 6
#define ERRPROC0 7
#define ERRPROC1 8
#define NETWORKTIMESYNC 9
#define NUMTIMERS 10

/* structures for holding local timers */
enum timertype_t {
	MILLISECS,
	MICROSECS
};
struct {
	enum timertype_t timertype;
	unsigned long basetime;
	unsigned long interval;
} localTimers[NUMTIMERS];

/****  end timer stuff *****/


const int addr = 0;

char spbuf[MAXBUFSIZE]; 		// temp buf for sprintfs, reused all over

/********  PARAMETERS READ FROM INI FILE with defaults ***********/
//default values are set here
struct ini_params {
	//char xbeeIp[17] = { 18,219,216,145,0,0,0,0,0,0,0,0,0,0,0,0,0 }; //Ip addr server
	char xbeeIp[17] =  "18.219.216.145"; //Ip addr server
	short xbeePort = 32159;		//the port to use on the server
	int secBetween = 10;		//sample send interval
	int psiPreFill = 20;
	int psiPostFill = 50;
	bool fillCheck = false;
	int fill = 0; 
	int fillMax = 90;
	float maxg = 3;
	char deviceId[20] = {'1',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
	char deviceReg[20] = {'1',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
	float fullScale = 100.0;
	float excitation = 5.0;
	float calFactor = 3.42;
	unsigned long sampleinterval = 50;  //interval in mS between samples to be averaged
} tankInit;
		
void getTankInit(const char *filename);  //load tank values from ini file
void process_accelerometer(void);	//read accel values and send

//pressure transducer value
float transducerInst;

DHT_Unified dht(dhtPin, dhtType);
Protocentral_ADS1220 adc;


/************  setup routine,  first entry point ****************/
void setup() {


	int i;
	const char *filename = "/device.ini";
	tankInit.fill = EEPROM.read(addr); //last number of fills from EEPROM

	//start the temp and humidity
	dht.begin();

	//analogReference(EXTERNAL);
	pinMode(pin1, INPUT);
	pinMode(pin2, INPUT);
	pinMode(pin3, INPUT);

	/* setup special I/O pins */

	//error LED
	pinMode(errorPin, OUTPUT);
	digitalWrite(errorPin, LOW);

	//reset xbee pin
	pinMode(resetPin, OUTPUT);
	
	//chipselect
	pinMode(csPin, OUTPUT);
	digitalWrite(csPin, HIGH);
	
	//sd card
	pinMode(SD_CS, OUTPUT);
	digitalWrite(SD_CS, HIGH);

	//PONDSCUM are these times actually required?
	//reset xbee
	digitalWrite(resetPin, HIGH);
	delay(500);
	digitalWrite(resetPin, LOW);
	delay(2000);

	/* Serial port to talk to XBEE 
	 * reset to 9600 which is default for new XBEE
	 * if replaced
	 */
	Serial3.begin(115200);

	/* Serial port for Debug console */
	Serial.begin(115200);
	Serial.println("debug console opened");

	/* init the SPI port */
	SPI.begin();

	/* open the SD card for access */
	for(i=0;(i<6) && (!SD.begin(SD_CS)) ;i++){
		sprintf(spbuf,"Failed to open SD - attempt: %d\n",i);
		Serial.print(spbuf);
		delay(1000);
	}
	/* now that we use defaults if SD inaccessibe, we flash
	 * the error light via timers from now on to indicate failure
	 * but go ahead and process messages
	 */
	if(i==6){
	    Serial.print("SD Card Inaccessible\n");
	    errorProcessor(0);
	}

	/* read in initial values from INI file */
	getTankInit(filename);

	/* start the adc at 330 samples per second continuous conversion
	 * DRDY is high when getting a sample,  low when sample ready
	 */
	adc.begin(csPin,drdyPin);
	adc.set_data_rate(DR_330SPS);
	adc.set_pga_gain(PGA_GAIN_64);

	//Configure for differential measurement between AIN0 and AIN1
	adc.select_mux_channels(MUX_AIN0_AIN1);  
	adc.Start_Conv();  //Start continuous conversion mode

	/* put xbee in API mode and set interface params with AT cmnds */
	setupXbee();

	/* if the cell modem has no signal,  this will not return 
	 * till it does 
	 */
	setupSockets();

	/* set time between samples and time between server transmissions */
	setLocalTimer(TRIGGERTIME,tankInit.sampleinterval,MILLISECS);
	setLocalTimer(TRIGGERSERVER,tankInit.secBetween*1000,MILLISECS);

	/* set up the first job once we have signal to go and get the time 
	 *	from the server. response is processed in main task loop below 
	 */
	timesync();

}//end setup



/*continuously entered main loop */
void 
loop() {

	int temp,hum;			//temp and humidity
	static long long pres_accum=0;  //the sum of all the 24 bit samples
	unsigned long pressure;		//the current pressue sample
	float pres;			//tank pressure 
	int len;			//temp var for length of strings

	/* secBetween is number of seconds between samples sent to server
	 * sampling is done the entire time at tankInit.sampleinterval mS  intervals 
	 * and  averaged before sent at tankInit.secBetween seconds
	 */
	static int numsamples  = 0;  	//number of samples taken during sample set
			      		//technically should be secBetween/SAMPLEINT
			      		//but there may be some jitter so keep 
					//track with numsamples

	/******** check if processing recoverable errors *******/
	checkerrs();


	/********************* COMM/NETWORK STUFF , do this every loop ***********/
	unsigned char *frameptr;	// local ptr for tracking api mode xbee comm frames

	/* any incoming frames from cell interface? */
	if( (frameptr=recvApiFrame()) != NULL){
		checkReceivedFrames(frameptr);
	}

	/* did we lose cell signal? */
	if(!cell_avail){
		Serial.println("");
		Serial.println("Lost Cell Signal in Main Loop");
		recovercell();
		if(!cell_avail)
			hdwreset();
	}
	/* any work outstanding on sendUDP ? */
	else if(packetpending !=0){
		if(timerExpired(PACKETTIMEOUT)){
			sprintf(spbuf,"Lost UDP packet frameid=0x%02x\r\n",packetpending);
			Serial.println(spbuf);
			hdwreset();
		}
	}


	/********************* STUFF TO DO EVERY LOOP VERY QUICKLY  ***********/
	//  nothing yet

	/********************* STUFF TO DO EVERY sampleinterval mS ***********/
	if( timerExpired(TRIGGERTIME) ) {

		//reset trigger for sample
		setLocalTimer(TRIGGERTIME,tankInit.sampleinterval,MILLISECS);

		numsamples++;

		/* process the accel data */
		process_accelerometer();

		/* so keep the 24 bit resolution 
		 * till do the math (floats/doubles are only 4 bytes) use long long or
		 * only get 255 samples before overflow and lose resolution of smaller avgs
		 */
		{
			unsigned long pressure;
			pressure = adc.Read_WaitForData();
			pres_accum += pressure;
		}

	}//end triggertime
		
	/****************** STUFF TO DO EVERY SERVER  tankInit.secBetween mS -usually seconds  */
	if(timerExpired(TRIGGERSERVER)){

			/* time to send data to server */
			Serial.print(millis());
			Serial.print(":");

			/* convert accumulated 24 bit samples to a calibrated 
			 * float pressure 
			 */
			pres  = calcpressure(pres_accum,numsamples);

			/* check the tank fills */
			tankcheck(pres);

			/* get temp and humidity */
			sensors_event_t event;
			dht.temperature().getEvent(&event);
			temp = event.temperature;
			dht.humidity().getEvent(&event);
			hum = event.relative_humidity;

			/* format and send the sample */
			len=sprintf(spbuf,"%s,location=%s pressure=%d.%02d,filled=%d,temp=%d,hum=%d\n",
				tankInit.deviceId,
				tankInit.deviceReg,
				(int)pres,
				abs((int)(pres*100)%100),
				tankInit.fill,
				temp,
				hum
			);
			Serial.print(spbuf);
			sendUDP(tankInit.xbeeIp,tankInit.xbeePort,spbuf,len);

			/* reset accumulators and timers */
			numsamples=0;
			pres_accum=0;
			setLocalTimer(TRIGGERSERVER,tankInit.secBetween*1000,MILLISECS);

	}//end triggerserver

}//end loop


/* set up the xbee before switching to api mode */
void 
setupXbee(void) {
	char readResp[16];
	bool atComMode = true;

	//have to delay one second or greater, write +++, and idle 1 second or greater
	//to enter command mode
	delay(1010);
	Serial3.write("+++");
	delay(1010);

	setLocalTimer(INITTIMER,5000,MILLISECS);
	while(atComMode) {
		if(Serial3.available()>0) {
			memset(readResp,0,sizeof(readResp));
			atComMode = false;
			Serial.println("waiting for CR");
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); 
			Serial.println(readResp);

			Serial.println("switch to API mode");
			Serial3.write("ATAP2\r"); 

			memset(readResp,0,sizeof(readResp));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); 
			Serial.println(readResp);

			Serial.println("disable remote manager");
			Serial3.write("ATDO0\r"); 
			memset(readResp,0,sizeof(readResp));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); 
			Serial.println(readResp);
			
			Serial.println("send WR mode");
			//must wait for OK after WR command before sending anymore characters
			Serial3.write("ATWR\r");
			memset(readResp,0,sizeof(readResp));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); Serial.println(readResp);
			
			Serial.println("close command mode");
			Serial3.write("ATCN\r"); 
			memset(readResp,0,sizeof(readResp));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); 
			Serial.println(readResp);
			delay(3000);
		}
		else if(timerExpired(INITTIMER)){
			errorProcessor(1);
	    	}
	}
}
	  


//PONDSCUM  change this to accumlate and average and send
//PONDSCUM should this be done every loop?  just save max value?
/* PONDSCUM this math needs to be moved to server */
void
process_accelerometer(void){

	int len;
	float arrx,arry,arrz;
	float mag;
	int fracx,fracy,fracz;
	/* read the accelerometer data */
	arrx = ((analogRead(pin1) - zeroGx)/scaleX);
	arry = ((analogRead(pin2) - zeroGy)/scaleY);
	arrz = ((analogRead(pin3) - zeroGz)/scaleZ);

	fracx= ((int)(arrx*100))%100;
	fracx=abs(fracx);
	fracy= ((int)(arrx*100))%100;
	fracy=abs(fracy);
	fracz= ((int)(arrx*100))%100;
	fracz=abs(fracz);

	mag= (float)sqrt( sq(arrx) + sq(arry) + sq(arrz) );
	if( mag > tankInit.maxg ) {
		len=sprintf(spbuf,
			"%s,location=%s mag=%d.%02d,x_axis=%d.%02d,y_axis=%d.%02d,z_axis=%d.%02d\n",
			tankInit.deviceId,
			tankInit.deviceReg,
			(int)mag,
			((int)(mag*100))%100,
			(int)arrx,
			fracx,
			(int)arry,
			fracy,
			(int)arrz,
			fracz
		);

		sendUDPSneaky(tankInit.xbeeIp,tankInit.xbeePort,spbuf,len);
		Serial.print(spbuf);
	}
}


/* read the pressure and convert to float */
/* PONDSCUM this needs to be moved to server */
float
calcpressure(long long pressure, unsigned long samples){


	float pressureval;

	pressureval = pressure/samples;

	pressureval  = (2*pressureval*bitToMicroVolt)/64.00; //transducer channel 1 and 0
	pressureval = (tankInit.fullScale/tankInit.excitation)*(pressureval/(tankInit.calFactor*1000)) - 14.62;
	return(pressureval);

}


/* look to see if tank has been filled */
void
tankcheck(float pres){

	if(pres < tankInit.psiPreFill) {
		tankInit.fillCheck = true;
	}

	if(tankInit.fillCheck && (pres > tankInit.psiPostFill)) {
		tankInit.fillCheck = false;
		tankInit.fill = EEPROM.read(addr);
		tankInit.fill += 1;
		EEPROM.write(addr, tankInit.fill);
	}
	if(tankInit.fill > tankInit.fillMax) {
		tankInit.fill = 0;
		EEPROM.write(addr, tankInit.fill);
	}
}


/*********************************************************
* Network code below this point
* Copyright G. Laggis
* all rights reserved
* used by permission to UTK civil engineering
*********************************************************/



/* construct an xbee api frame
 * with checksum and header to send to xbee
 */
unsigned char *
makeApiFrame(unsigned char frameType, 
		unsigned char *data, 
		short datalen)
{

	/* frame is
	 * 0x7e lenhi lenlo frametype databytes checksum
	 */

	int i;
	static unsigned char apiFrame[MAXBUFSIZE]; //the frame returned
	unsigned char *dptr, *fptr;
	int checksum;	//checksum accumulator (add all bytes, mask, sub from 0xff

	apiFrame[DELIMITER]=0x7E;

	datalen++;		//to include FRAMETYPE
	apiFrame[LENHI]=highByte(datalen);	//insert lens
	apiFrame[LENLO]=lowByte(datalen);

	apiFrame[FRAMETYPE]=frameType;

	dptr=data;
	fptr=apiFrame+FRAMEDATA;
	for(i=0;i<datalen;i++){
		*fptr++ =*dptr++;
	}

	checksum=0;
	for(i=FRAMETYPE;i<datalen+FRAMETYPE;i++){
		checksum+=apiFrame[i];
	}
	checksum &= 0xFF;
	checksum = 0xFF - checksum;
	apiFrame[i]=(unsigned char)checksum;
	return(apiFrame);
}
	
/* send an api frame to xbee and 
 * escape any control characters by stuffing
 */
void
sendApiFrame(unsigned char *frame){
	int i;
	int len;
	int stuffedlen;
	unsigned int sent;
	unsigned char buf[MAXBUFSIZE];

	/* frame to be sent */
	Serial.print("SEND: ");
	printApiFrame(frame);

	len=(frame[LENHI]<<8)|frame[LENLO];

	//gotta escape characters in mode 2
	/* +1 here to include checksum  which also must be stuffed */
	/* even though its not in length */
	stuffedlen=0;
	buf[stuffedlen++]=frame[0];
	for(i=1;i<len+FRAMETYPE+1;i++){
		switch( frame[i] ){
			case 0x7e:
			case 0x7d:
			case 0x11:
			case 0x13:
				buf[stuffedlen++]=0x7d;  //7d is the flag byte
				buf[stuffedlen++]=frame[i]^0x20; //XOR to mod offending byte
				break;
			default:
				buf[stuffedlen++]=frame[i];
				break;
		}
	}
#ifdef FULLDEBUG
	Serial.println("stuffed buffer");
	for(i=0;i<stuffedlen;i++){
		sprintf(spbuf,"%02X ",buf[i]);
		Serial.print(spbuf);
	}
	Serial.println("");
#endif
	sent=Serial3.write(buf,stuffedlen);
	Serial.write("Sent: ",6);
	Serial.println(sent);
					
}

/* print a frame based on its internal length */
void
printApiFrame(unsigned char *frame){

	int i;
	int len;
	len=(frame[LENHI]<<8)|frame[LENLO];
#ifdef FULLDEBUG
	sprintf(spbuf,"Len=%d\r\n",len);
	Serial.write(spbuf);
	for(i=0;i<len+FRAMETYPE+1;i++){
		sprintf(spbuf,"%02X ",frame[i]);
		Serial.print(spbuf);
	}
	Serial.println(" ");
#else
	for(i=0;(i<16)&&(i<len+FRAMETYPE+1);i++){
		sprintf(spbuf,"%02X ",frame[i]);
		Serial.print(spbuf);
	}
	Serial.println(" ");
#endif
}

/* if no frame ready, return null, else receive and return it */
unsigned char *
recvApiFrame()
{
	int i;
	static unsigned char recv_apiFrame[MAXBUFSIZE];
	bool startframe;
	int lenhi, lenlo, len;
	unsigned char retchar;
	int checksum;
	int a;
	
	memset(recv_apiFrame,0,MAXBUFSIZE);
	checksum=0;

	i=0;
	startframe=false;
	while(Serial3.available() > 0){
		a=Serial3.read();
		sprintf(spbuf,"r-%02X ",a);
		Serial.print(spbuf);
		recv_apiFrame[i]=a;
		if(recv_apiFrame[i]==0x7E){
			startframe=true;
			i++;
			break;
		}
	}

	
	if(startframe){
		/* wait on the next char for 3000 uSec (3mS) */
		/* next char is len hi */
		if(waitonchar(&retchar,3000)){;
			recv_apiFrame[i++]=retchar;
			lenhi=retchar;
		}
		else{
			Serial.println("Never got lenhi");
			return(NULL);
		}
	
		/* next char is len lo */
		if(waitonchar(&retchar,3000)){;
			recv_apiFrame[i++]=retchar;
			lenlo=retchar;
		}
		else{
			Serial.println("Never got lenlo");
			return(NULL);
		}

		len=(lenhi<<8)|lenlo;
		checksum=0;
		for(i=FRAMETYPE;i<len+FRAMETYPE+1;i++){
			if(waitonchar(&retchar,3000)){;
				recv_apiFrame[i]=retchar;
				checksum+=retchar;
			}
			else{
				Serial.println("busted packet");
				return(NULL);
			}
		}

		if((checksum & 0xFF) != 0xFF){
			Serial.println("BAD checksum");
			Serial.println(checksum,HEX);
			return(NULL);
		}
		else{
			Serial.println("");
			Serial.print("RECV:");
			printApiFrame(recv_apiFrame);
			return(recv_apiFrame);
		}
	}
	else
		return(NULL);
}
		

int statframes=0;
int ackframes=0;
/* routine to wait on cell signal, then setup socket and bind UDP port */
void
setupSockets(){
	unsigned char setupseq;
	unsigned char *frameptr;


	setupseq=0;
	setLocalTimer(WAITTIME,100,MILLISECS);

	digitalWrite(errorPin, HIGH);
	/* wait for radio service */
	while(!cell_avail){

		if(timerExpired(WAITTIME)){

			if(setupseq++ > 8)
				setupseq=0;
			sprintf(spbuf,"%cAI",setupseq+CELLSTATID);

			frameptr=makeApiFrame(ATCMND, (unsigned char *)spbuf, 3);
			statframes++;
			sendApiFrame(frameptr);

			/* wait for the CELLSTATID frame to return 
			 * checkReceivedFrames is called in waitForFrameId so cell_avail 
			 * will be reset if cell becomes available
			 */
			if((frameptr=waitForFrameId(setupseq+CELLSTATID))==NULL){
				Serial.println("No Frames Found waiting for cell_avail") ;
				hdwreset();
			}
			setLocalTimer(WAITTIME,5000,MILLISECS);
		}
	}
	
	/* just to make sure all our packets came back and no poison pill is hanging
         * around waiting to crash in on the traffic
         */
	Serial.print("stats:");
	Serial.println(statframes);
	Serial.print("acks:");
	Serial.println(ackframes);

#ifdef VERSION3
    donesetup=false;
    while(!donesetup){

	digitalWrite(errorPin, HIGH);
		
	/* close any already open socket */
	if(socketid != BADSOCK){
		tbuf[0]=0;
		tbuf[1]=socketid;
		tbuf[2]='\0';
		packetptr=makeApiFrame(0x43,tbuf,2);
		sendApiFrame(packetptr);
	}

	socketid=BADSOCK;

	/* use frame ids from 20 hex and up to sequence
	   through setup process */
	PONDSCUM
	setupseq=SETUPFRAMES;
	tbuf[0]=setupseq;   //frameid
	tbuf[1]=0;   //UDP protocol
	tbuf[2]='\0';//terminator for local Frame routines

	/* send the create socket command */
	Serial.println("Create Socket");
	packetptr=makeApiFrame(0x40,tbuf,2);
	sendApiFrame(packetptr);
	if((frameptr=waitForFrameId(setupseq)) == NULL){
			Serial.println("Failure on Socket Create");
			hdwreset();
	}
	else{
		switch(frameptr[FRAMEID+2]){
			case 0:
				Serial.println("Success socketcreate");
				socketid=frameptr[FRAMEID+1];
				break;
			case 0x22:
				Serial.println("Not Registered to cellnetwork");
				break;
			case 0x31:
				Serial.println("Internal Error");
				break;
			case 0x32:
				Serial.println("Resource Error");
				break;
			case 0x7B:
				Serial.println("Invalid Protocol");
				break;
			default:
				Serial.println("Invalid Status");
				break;
		}//end switch

		if(socketid==BADSOCK){
			delay(5000);
			continue;
		}
		else
			break;
	}

	/* send bind command */
			
	setupseq++;
	tbuf[0]=setupseq;   //frameid
	tbuf[1]=socketid;   //socket to bind
	tbuf[2]=0xaa;	//arbitrary src port hi
	tbuf[3]=0xbb;	//arbitrary src port lo
	tbuf[4]='\0';//terminator for local Frame routines

	/* send the bind */
	Serial.println("BIND command");
	packetptr=makeApiFrame(0x46,tbuf,4);
	sendApiFrame(packetptr);
	if((frameptr=waitForFrameId(setupseq)) == NULL){
			Serial.println("Timeout on Bind");
			hdwreset();
	}
	else{
		switch(frameptr[FRAMEID+2]){
			case 0:
				Serial.println("Success socketcreate");
				break;
			case 0x01:
				Serial.println("Invalid Port");
				continue;
			case 0x02:
				Serial.println("Error");
				continue;
			case 0x03:
				Serial.println("Already Bound");
				continue;
			case 0x20:
				Serial.println("Invalid Socket");
				continue;
			default:
				Serial.println("Invalid Status");
				continue;
		}//end switch
	}//end else
	donesetup=true;
	digitalWrite(errorPin, LOW);
    }//end donesetup loop
#endif

	digitalWrite(errorPin, LOW);
}
	

/* perform a quick check for state of cell avail */
void
recovercell()
{
	unsigned char *frameptr;

	delay(3000);
	sprintf(spbuf,"%cAI",CELLSTATID);

	frameptr=makeApiFrame(ATCMND, (unsigned char *)spbuf, 3);
	sendApiFrame(frameptr);

	/* wait for the CELLSTATID frame to return 
	 * checkReceivedFrames is called in waitForFrameId so cell_avail 
	 * will be reset if cell becomes available
	 */
	if((frameptr=waitForFrameId(CELLSTATID))==NULL){
		Serial.println("No Frames Found waiting for cell_avail") ;
		hdwreset();
	}
}

/* monitor the xbee waiting for a particular incoming frameid */
unsigned char *
waitForFrameId(unsigned char frameid){

	unsigned char *frameptr;
	bool gotframeid;

	gotframeid=false;
	while(!gotframeid){
		setLocalTimer(LOCSOCKTIMER,LOC_SOCKTIMEOUT,MILLISECS);
		while( (frameptr=recvApiFrame()) == NULL){
			if(timerExpired(LOCSOCKTIMER)){
				Serial.println("Timeout on waitForFrameId");
				return(NULL);
			}
		}
		checkReceivedFrames(frameptr);
		if(frameptr[FRAMEID] == frameid){
			gotframeid=true;
		}
		else{
			Serial.println("Not ID, Status Frame");
		}
	}
	return(frameptr);
}

/* use fixed FRAMESIZE udp frames for simplicity on both ends
 * allows use of mode 1 api code also which is simple as long a length of
 * frame is not 0x7E, 0x7D, 0x11, 0x13.  these cannont appear in data either
 */
void
sendUDP(const char *addr,short port, const char *packetdata, int packetlen)
{

	unsigned char udpPacket[FRAMESIZE];
	unsigned int ip[4];
	int i;
	unsigned char *packetptr;
	static int framid=0;

	if(packetpending!=0){
		Serial.print("LOST PACKET #:");
		Serial.println(packetslost++);
		packetpending=0;
	}
	packetstotal++;

	memset(udpPacket,0,FRAMESIZE);

	if(framid++ > 9)
		framid=1;

	//arbitrary frame id
	packetpending=udpPacket[0]=framid+FRAMEDATAID;
	sscanf(addr,"%d.%d.%d.%d",&ip[0],&ip[1],&ip[2],&ip[3]);
	udpPacket[1]=ip[0];		//ip addr
	udpPacket[2]=ip[1];		//ip addr
	udpPacket[3]=ip[2];		//ip addr
	udpPacket[4]=ip[3];		//ip addr
	udpPacket[5]=((port&0xFF00)>>8);	//dest port
	udpPacket[6]=((port&0x00FF));		//dest port
	udpPacket[7]=0;		//source port
	udpPacket[8]=0;		//source port
	udpPacket[9]=0;		//protocol
	udpPacket[10]=0;		//transmit options
	/* payload */
	for(i=11;i<packetlen+11;i++){
		udpPacket[i] = *packetdata++;
	}

	//make udp frame into api frame
	packetptr=makeApiFrame(APITXREQ,udpPacket,FRAMESIZE);
	//send udp encapsulated in api frame
	sendApiFrame(packetptr);
	setLocalTimer(PACKETTIMEOUT,SENDUDP_TIMEOUT,MILLISECS);
}


/* same as above funcion except doesn't affect timers so can sneak a UDP packet 
   between timers.  too confusing with special cases so just duplicated code here */

void
sendUDPSneaky(const char *addr,short port, const char *packetdata, int packetlen)
{

	unsigned char udpPacket[FRAMESIZE];
	unsigned int ip[4];
	int i;
	unsigned char *packetptr;
	static int framid=0;

	packetstotal++;

	memset(udpPacket,0,FRAMESIZE);

	if(framid++ > 9)
		framid=1;

	//arbitrary frame id
	udpPacket[0]=framid+SNEAKYFRAME;
	sscanf(addr,"%d.%d.%d.%d",&ip[0],&ip[1],&ip[2],&ip[3]);
	udpPacket[1]=ip[0];		//ip addr
	udpPacket[2]=ip[1];		//ip addr
	udpPacket[3]=ip[2];		//ip addr
	udpPacket[4]=ip[3];		//ip addr
	udpPacket[5]=((port&0xFF00)>>8);	//dest port
	udpPacket[6]=((port&0x00FF));		//dest port
	udpPacket[7]=0;		//source port
	udpPacket[8]=0;		//source port
	udpPacket[9]=0;		//protocol
	udpPacket[10]=0;		//transmit options
	/* payload */
	for(i=11;i<packetlen+11;i++){
		udpPacket[i] = *packetdata++;
	}

	//make udp frame into api frame
	packetptr=makeApiFrame(APITXREQ,udpPacket,FRAMESIZE);
	//send udp encapsulated in api frame
	sendApiFrame(packetptr);
}

/* wait the specified amount of time in utime for a character to show
   up on serial port.  used as an intercharacter timer mostly */
bool
waitonchar(unsigned char *retchar, unsigned long  utime){
	unsigned char locchar;
	
	setLocalTimer(CHARSTART,utime,MICROSECS);

	while(Serial3.available() == 0){
		if( timerExpired(CHARSTART) ){
			Serial.println("timeout in wait on char");
			return(false);  //bad,  timeout
		}
	}
	
	locchar=Serial3.read();

	sprintf(spbuf,"%02X ",locchar);
	Serial.print(spbuf);

	/* frame restart,  whoops reject last frame and this one and start over */
	if(locchar == 0x7e){
		Serial.println("Frame restart");
		return(false);
	}

	else if(locchar==0x7d){
		//oouuu,  recursion!
		if( !waitonchar(&locchar,3000) )
			return(false);  //error on fetching real char after stuffing
		else{
			*retchar=locchar^0x20;
		}
	}
	else 
		*retchar=locchar;
		
		return(true);
}
		


/* all received frames will eventually end up here 
* check their framid's to see what to do with them
* except for AT frame,  check its and AT resp for that one 
*/
void
checkReceivedFrames(unsigned char *frameptr){

	switch(frameptr[FRAMETYPE]){
		case ATCMNDRESP:
			Serial.println("AT cmnd response");
			/* is upper nibble equal to cellstat ids */
			if((frameptr[FRAMEID]&0xF0)==CELLSTATID){
				ackframes++;
				switch(frameptr[8]){
					case 0x00:
						Serial.println("connected/active");
						digitalWrite(errorPin, LOW);
						cell_avail=true;
						break;
					case 0x22:
						Serial.println("registering");
						cell_avail=false;
						break;
					case 0x23:
						Serial.println("connecting");
						cell_avail=false;
						break;
					default:
						Serial.println("Invalid Status");
						
				}
			}
			else{
				Serial.println("ATCMND not recognized");
			}
			break;

		case MODEMSTATUS:
			Serial.println("MODEM Status");
			switch(frameptr[4]){
				case 0:
					Serial.println("Hardware reset or power up");break;
				case 1:
					Serial.println("Watchdog timer reset");break;
				case 2:
					Serial.println("Registered with cellular network");break;
				case 3:
					Serial.println("Unregistered with cellular network");
					cell_avail=false;
					break;
				case 0x0E:
					Serial.println("Rmt Mgr conn");break;
				case 0x0F:
					Serial.println("Rmt Mgr disc");break;
				case 0x35:
					Serial.println("Cell update started ");break;
				case 0x36:
					Serial.println("Cell update failed ");break;
				case 0x37:
					Serial.println("Cell update completed ");break;
				case 0x38:
					Serial.println("XBee fw update started");break;
				case 0x39:
					Serial.println("XBee fw update failed");break;
				case 0x3A:
					Serial.println("XBee fw update applying");break;
				default:
					Serial.println("Invalid Status");
				}
			break;

		case SOCKCREATERESP:
			Serial.println("SOCKET CREATE  Status");
			break;

		case APITXREQRESP:
			Serial.println("TX cmnd response");
			/* is upper nibble equal to cellstat ids */
			if((frameptr[FRAMEID])==packetpending){
				packetpending=0;
				switch(frameptr[FRAMEID+1]){
					case 0x0: 
						Serial.println("Succesful Transmit");
						break;
					case 0x21: 
						Serial.println("Fail xmit to cell network");
						cell_avail=false;
						packetslost++;
						break;
					case 0x22: 
						Serial.println("Not registered to net");
						packetslost++;
						cell_avail=false;
						break;
					case 0x2c: 
						Serial.println("Invalid frame values");
						packetslost++;
						break;
					case 0x31: 
						//this has to be bad
						Serial.println("Internal error");
						packetslost++;
						hdwreset();
						break;
					case 0x32: 
						//out of sockets,  big problem
						Serial.println("Resource error");
						packetslost++;
						hdwreset();
						break;
					case 0x74: 
						Serial.println("Message too long");
						packetslost++;
						break;
					case 0x76: 
						Serial.println("Socket closed,surprise!");
						packetslost++;
						break;
					case 0x78: 
						Serial.println("Invalid UDP port");
						packetslost++;
						break;
					case 0x79: 
						Serial.println("Invalid TCP port");
						packetslost++;
						break;
					case 0x7A: 
						Serial.println("Invalid host address");
						packetslost++;
						break;
					case 0x7B: 
						Serial.println("Invalid data mode");
						packetslost++;
						break;
					case 0x7C: 
						Serial.println("Invalid interface");
						packetslost++;
						break;
					case 0x7D: 
						Serial.println("Interface relay err");
						packetslost++;
						break;
					case 0x80: 
						Serial.println("Connect refused");
						packetslost++;
						break;
					case 0x81: 
						Serial.println("Socket connection lost");
						packetslost++;
						break;
					case 0x82: 
						Serial.println("No server");
						packetslost++;
						break;
					case 0x83: 
						Serial.println("Socket closed");
						packetslost++;
						break;
					case 0x84: 
						Serial.println("Unknown server");
						packetslost++;
						break;
					case 0x85: 
						//this isn't good either
						packetslost++;
						Serial.println("Unknown error");
						hdwreset();
						break;
					case 0x86: 
						Serial.println("Invalid TLS");
						packetslost++;
						break;
					default:
						Serial.println("Invalid Status");
						packetslost++;
						
				}
			}
			else{
				sprintf(spbuf,
					"TX RESP: frame 0x%02x order",frameptr[FRAMEID]);
				Serial.println(spbuf);
			}

			sprintf(spbuf,"Stats::%d/%d",packetslost,packetstotal);
			Serial.println(spbuf);

			break;

		case RECVDATA:
			Serial.println("Incoming msg");
			if(strncmp(frameptr+14,"<t=",3)==0){
				sscanf(frameptr+17,"%ld",&networktime);
				Serial.print("Syncing Time: ");
				Serial.println(networktime);
				break;
			}

		default:
			Serial.println("random status traffic");
	}
}



/* set up a local timer in the localTimers array*/
void
setLocalTimer(int timerid, unsigned long interval, enum timertype_t timertype){

	if(localTimers[timerid].timertype == MILLISECS)
		localTimers[timerid].basetime=millis();
	else
		localTimers[timerid].basetime=micros();

	localTimers[timerid].interval=interval;
	localTimers[timerid].timertype=timertype;
}

/* check a localTimer value, call this routine periodically to see if it expired */
bool
timerExpired(int timerid){

	unsigned long currtimer;

	if(localTimers[timerid].timertype == MILLISECS)
		currtimer=millis();
	else
		currtimer=micros();
	
	if((currtimer-localTimers[timerid].basetime)>=localTimers[timerid].interval){
		return(true);	//fire timer
	}
	else
		return(false);
}


/* reset the whole shooting match */
void
hdwreset(){
	void (*startover)(void)=0;
	Serial.println("RESETTING") ;
	Serial.flush();
	Serial3.flush();
	delay(2000);
	startover();  //pull the plug, we are toast
			   //this will reset xbee and 
			   //restart everything
}


/* get the tank initial values from sd card and overwrite defaults */
void
getTankInit(const char *filename){

	const size_t bufferLen = 80;
	char buffer[bufferLen];

	unsigned int i;
	bool defaultflag;
	
	defaultflag=false;

	IniFile ini(filename);

	if(!ini.open()) {
		sprintf(buffer,"Ini file: %s does not exist\n",filename);
		Serial.print(buffer);
		Serial.println("Defaults Being Assumed");
		errorProcessor(0);
	}
	else{
		Serial.println("Ini file exists");  

		memset(buffer,0,sizeof(buffer));
		if( ini.getValue("server info", "server_ip", buffer, sizeof(buffer))) {
			strcpy(tankInit.xbeeIp,buffer);
		}
		else{
			Serial.println("Defaulting ip");
		}
			
		
		memset(buffer,0,sizeof(buffer));
		if( ini.getValue("server info", "server_port", buffer, sizeof(buffer))) {
			sscanf(buffer,"%hd",&tankInit.xbeePort);
		}
		else{
			Serial.println("Defaulting Port");
		}


		if( !ini.getValue("filled def", "psi_pre_fill", buffer, bufferLen, tankInit.psiPreFill)) {
			defaultflag=true;
		}

		if( !ini.getValue("filled def", "psi_post_fill", buffer, bufferLen, tankInit.psiPostFill)) {
			defaultflag=true;
		}

		if( !ini.getValue("sec between", "sec_between", buffer, bufferLen, tankInit.secBetween)) {
			defaultflag=true;
		}

		if(!ini.getValue("sec between", "samp_interval", buffer, bufferLen, tankInit.sampleinterval)) {
			defaultflag=true;
		}

		if(!ini.getValue("maximum g", "maximum_g", buffer, bufferLen, tankInit.maxg)) {
			defaultflag=true;
		}

		if(!ini.getValue("fill max", "fill_max", buffer, bufferLen, tankInit.fillMax)) {
			defaultflag=true;
		}

		if(ini.getValue("device id", "device_id", buffer, bufferLen)) {
			//PONDSCUM why not bufferLen?
			for(i = 0; (i < sizeof(buffer)) && (buffer[i] != '\0'); i++) {
				tankInit.deviceId[i] = buffer[i];
			}
			tankInit.deviceId[i] = '\0';
		}
		else{
			defaultflag=true;
		}

		if(ini.getValue("device id", "device_region", buffer, bufferLen)) {
			for(i = 0; (i < sizeof(buffer)) && (buffer[i] != '\0'); i++) {
				tankInit.deviceReg[i] = buffer[i];
			}
			tankInit.deviceReg[i]='\0';
		}
		else{
			defaultflag=true;
		}

		if(!ini.getValue("transducer params", "full_scale", buffer, bufferLen, tankInit.fullScale)) {
			defaultflag=true;
		}

		if(!ini.getValue("transducer params", "excitation_voltage", buffer, bufferLen, tankInit.excitation)) {
			defaultflag=true;
		}

		if(!ini.getValue("transducer params", "calibration_factor", buffer, bufferLen, tankInit.calFactor)) {
			defaultflag=true;
		}
	}

	if(defaultflag){
		Serial.println("Some Values Have assumed Default Values");
	}

	/* dump values to be used */
	sprintf(spbuf,"%s",tankInit.xbeeIp);
	Serial.println(spbuf);

	Serial.print("xbeeport: ");
	Serial.println(tankInit.xbeePort);

	Serial.println(tankInit.psiPreFill);
	Serial.println(tankInit.psiPostFill);
	Serial.print("Send Sample Interval (secs): ");
	Serial.println(tankInit.secBetween);
	Serial.print("Local Sampling Precision (mS): ");
	Serial.println(tankInit.sampleinterval);
	Serial.println(tankInit.maxg);  
	Serial.println(tankInit.fillMax);
	Serial.println(tankInit.deviceId);
	Serial.println(tankInit.deviceReg);
	Serial.println(tankInit.fullScale);
	Serial.println(tankInit.excitation);
	Serial.println(tankInit.calFactor);

	if( (tankInit.secBetween * 1000) <= SENDUDP_TIMEOUT ){
		Serial.println("WARNING: SENDUDP_TIMEOUT greater than secBetween, packet panic may occur");
	}

	ini.close();

}

void
checkerrs(){
	/* if err0 (or any other)  flag is active */
	if(err0){
		/* and the timer is expired */
		if(timerExpired(ERRPROC0)){
			errorProcessor(0);
		}
	}
}


/* blink the error led or take remedial action based on error type */
/* if error is not set,  set it */
void 
errorProcessor(uint8_t error) {

	static unsigned char  err0state=0x0;
	static unsigned char  err1state=0x0;

	
	/* recoverable error 0 */
	/* but flash lights continuously to let know on default values */
	if(error == 0) {
		switch(err0state){
			case 0:
				err0=true;
				setLocalTimer(ERRPROC0,125,MILLISECS);
				digitalWrite(errorPin, HIGH);
				break;
			case 1:
				setLocalTimer(ERRPROC0,125,MILLISECS);
				digitalWrite(errorPin, LOW);
				break;
			case 2: 
				setLocalTimer(ERRPROC0,125,MILLISECS);
				digitalWrite(errorPin, HIGH);
				break;
			case 3:
				setLocalTimer(ERRPROC0,125,MILLISECS);
				digitalWrite(errorPin, LOW);
				break;
			case 4:
				setLocalTimer(ERRPROC0,500,MILLISECS);
				digitalWrite(errorPin, LOW);
				break;
	  	}
		if(++err0state >4)
			err0state=0;
	} 
	/* unrecoverable error, flash pattern for 10 seconds then reset and try again */
	else if(error == 1) {
		int i;
		/* flash a pattern on lights 10 times (about 10 secs) then restart and try again */
		for(i=0;i<10;i++){
			Serial.println("Error 1: unable to communicate with xbee");
			switch(err1state){
				case 0:
					err1=true;
					setLocalTimer(ERRPROC1,125,MILLISECS);
					digitalWrite(errorPin, HIGH);
					break;
				case 1:
					setLocalTimer(ERRPROC1,125,MILLISECS);
					digitalWrite(errorPin, LOW);
					break;
				case 2: 
					setLocalTimer(ERRPROC1,125,MILLISECS);
					digitalWrite(errorPin, HIGH);
					break;
				case 3:
					setLocalTimer(ERRPROC1,125,MILLISECS);
					digitalWrite(errorPin, LOW);
					break;
				case 4:
					setLocalTimer(ERRPROC1,125,MILLISECS);
					digitalWrite(errorPin, HIGH);
					break;
				case 5:
					setLocalTimer(ERRPROC1,125,MILLISECS);
					digitalWrite(errorPin, LOW);
					break;
				case 6:
					setLocalTimer(ERRPROC1,125,MILLISECS);
					digitalWrite(errorPin, HIGH);
					break;
				case 7:
					setLocalTimer(ERRPROC1,500,MILLISECS);
					digitalWrite(errorPin, LOW);
					break;
			}
			if(++err1state > 7)
				err1state=0;
			/* wait for timer to expire */
			while(!timerExpired(ERRPROC1));
		}
		hdwreset();
	}
}


/* send a packet to trigger a network time response from cell modem */
void
timesync()
{
	unsigned char *frameptr;
	int len;
	len=sprintf(spbuf,"TIME?");
	sendUDP(tankInit.xbeeIp,tankInit.xbeePort,spbuf,len);

	/* only use this code if want periodic updates on time but
           that will cause jitter and missed samples */
	/*if(timerExpired(NETWORKTIMESYNC)){
		len=sprintf(spbuf,"TIME?");
		sendUDPSneaky(tankInit.xbeeIp,tankInit.xbeePort,spbuf,len);
		setLocalTimer(NETWORKTIMESYNC,1000*60*10,MILLISECS);
	}
	*/
}
	

