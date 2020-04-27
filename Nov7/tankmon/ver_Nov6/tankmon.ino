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
#include "queues.h" 
#include "loctimers.h" 
#include "tankinit.h" 
#include "apiframes.h" 
#include "LocEEprom.h" 
#include "debug.h" 

/* The at2650 talks to an xbee in API 2  mode using virtual frames over serial connect 
 * Frame IDs are used to identify the packet types by convention here:
 * 0x20-0x29 are setup frames 
 * 0xa0-0xa9 are normal data xmit frames
 * 0x70-0x79 are used to poll for cell status
 * 0x90-0x99 are used for sneaky packets (quick sends outside protocol)
 */

/*
 * sendUDP sendUDPsneaky send udp encapsulated in the xbee protocol to be stripped and sent.
 * checkReceivedFrames looks at returned frames from xbee and updates status variables
 * the main loop is mostly timers that go off and cause various data to be send.
 * the first of the main loop checks that the cell connection is still active and tries to
 * recover if it disappears as the result of an checkReceivedFrames  status saying its lost.
 */

/*
 * Everything has an error timer,  even inter-character receives so this code should never hang.
 * important due to the amount of time required for a full reset
 */

/* lists/queues wind through the heap of memory declared as 
 * fixed size buffers in elements array.
 * like our own little memory manager since memory is so scarce and we need lots 
 * of buffers.   everything in enqueue will be buffered to SD card 
 * in event of freelist exhaustion.
 * in short,  things get enqueued in send q and peeled off and sent as quickly
 * as network will allow.  if it overruns,  buffer to SD card.  
 * everything is timestamped so it is all order independent till it hits influx
 * where the dbase sorts out the chronology.
 * every freecount>highwater, roll the SD card back 
 * out onto network and move it out.  SD card packets are full packets.
 * memory queue packets are condensed packets.  
 */

/* here is all the memory to be divided up into list elements */
struct memelement elements[TOTALLISTELEMENTS];

elementindex freelisthead;	//head of free element list, initiall all of memory
elementindex freelistcount;	//count of items on freelist 
//PONDSCUM TEST
elementindex ofreelistcount;	//shadow pointer for debug

/* the queue for packets to be sent now */
struct elementlist sendqueue;

/* backward looking accel packets that may be sent.
 * joined as an entire list to the sendqueue if a g event occurs 
 * in the meantime just a circulating queue of old data about 50 deep 
 * BACKSAMPLES tunable.  doesn't matter once hit BACKSAMPLES if we
 * overwrite in circles cause all entries are timestamped so can be joined 
 * in mass to sendqueue  (see appendListToList)
 */
struct elementlist accelqueue;

unsigned int packetstotal=0;	//counter for total packets 
unsigned int packetslost=0;	//counter for lost packets

bool err0 = false;	//flags to indicate err has been tripped
bool err1 = false;	//so can blink LEDs

/* real time tracking */
struct networktime_t {
	unsigned long  secs;
	unsigned long  usecs;
	unsigned long  localMicroSecs;
	}
	networktime;	//network time from server

unsigned char packetpending=0;  //frame id of any sendUDP outstanding, 0 means none
bool cell_avail=false;		//false till cell signal detected by xbee
byte recovertries=0;		//count of number of times recovery cell signal has been tried
bool wifi_avail=false;		//false till wifi is connected

char spbuf[MAXBUFSIZE]; 		// temp buf for sprintfs, reused all over

/* read transducer stuff */
void process_accelerometer(void);	//read accel values and send

//pressure transducer value
float transducerInst;

DHT_Unified dht(dhtPin, dhtType);
Protocentral_ADS1220 adc;


/* SD card flags */
File fd_SD;		 /* file desc for reading/writing buffer file on sd card */
bool fd_SDwriteMode=false;	/* is SDbuf open for reading or writing, can't do both */
bool fd_open=false;		/* is the SD buffer open */
bool qtoSD=false;	 /* whether we are overloaded and queueing to SD card */
bool dataONSD=true;      /* indicates there is data on SD card and card is closed */
			 /* make it true first time and check for stranded files then set it false */

byte globbufcounter=0;

/************  setup routine,  first entry point ****************/
void setup() {


	int i;
	const char *filename = "/device.ini";
	struct LocEEprom ee;

	EEPROM.get(addr,ee); //eeprom data

	/* invalid EEPROM, reset it */
	if(ee.validflag != 0xFEEDBEEF){
		ee.fills=0;
		ee.validflag=0xFEEDBEEF;
		ee.reset1pwr0=0;
		/* note,  .put doesn't write locs that havent changed */
		EEPROM.put(addr,ee); 
	}
	tankInit.fill=ee.fills;
		

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

	//reset xbee
	digitalWrite(resetPin, HIGH);
	delay(500);
	digitalWrite(resetPin, LOW);
	delay(2000);

	/* Serial port to talk to XBEE 
	 * reset to 9600 which is default for new XBEE
	 * if replaced
	 */
	//Serial3.begin(9600);
	Serial3.begin(115200);

	/* Serial port for Debug console */
	Serial.begin(115200);
	Serial.println(F("debug console opened"));

	Serial.println(F("Parameter Check of queues.h values: "));
	Serial.println((int)TOTALLISTELEMENTS);
	Serial.println((int)BACKSAMPLES);
	Serial.println((int)FREELISTHIGHWATER);
	Serial.println((int)FREELISTLOWATER);

	if( TOTALLISTELEMENTS > 256) {
		Serial.println(F("ERR: TOTALLIST > 256"));
	}

	else if( (TOTALLISTELEMENTS-BACKSAMPLES) <10) {
		Serial.println(F("ERR: BACKSAMPLES TO HI OR TOTALLIST TOO SMALL"));
	}
	else if( (FREELISTLOWATER) <4) {
		Serial.println(F("ERR: FREELISTLOWATER MARGINAL"));
	}
	else if( (FREELISTLOWATER) <2) {
		Serial.println(F("ERR: FREELISTLOWATER TOO SMALL"));
		Serial.println((int)FREELISTLOWATER);
	}
	else if( FREELISTHIGHWATER >= (TOTALLISTELEMENTS-BACKSAMPLES-1) ) {
		Serial.println(F("FREELISTHIGHWATER TOO LARGE"));
		Serial.println((int)FREELISTHIGHWATER);
	}
	else{
		Serial.println(F("TUNABLES OK"));
	}

		
	Serial.print(F("Fills: "));
	Serial.println(ee.fills);
	Serial.print(F("validflag: 0x"));
	Serial.println(ee.validflag,HEX);
	Serial.print(F("reset1pwr0: "));
	Serial.println(ee.reset1pwr0);

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

	//calibrate the accelerometer
	calibaccel();

	/* put xbee in API mode and set interface params with AT cmnds */
	setupXbee();

	/* we have to sync time somehow,  either wifi or cell */
	/* till we get one or the other, at least for a time sync, gotta wait */
	/* if the cell modem has no signal,  this will not return 
	 * till it does 
	 */
	setupSockets();

	/* remove any buffer file from last time after a powerup */
	if(ee.reset1pwr0 == 0){
		Serial.print(F("REMOVE "));
		Serial.println(SDBUFFILE);
		SD.remove(SDBUFFILE);
	}
	else{
		/* if it was a reset, don't remove old data */
		Serial.print(F("RESET, Do Not Remove "));
		Serial.print(SDBUFFILE);
		ee.reset1pwr0=0;
		EEPROM.put(addr,ee);
	}


	//do this again after xbee is active and connected.
	//makes a big difference in calibration
	calibaccel();

	/* set time between samples and time between server transmissions */
	setLocalTimer(TRIGGERTIME,tankInit.sampleinterval,MILLISECS);
	setLocalTimer(TRIGGERSERVER,tankInit.secBetween*1000,MILLISECS);
	setLocalTimer(SDCHECKTIMER,1,MICROSECS); //just so it expires and we check for old data
	//PONDSCUM FIX
	//this one is not stored on SD card yet, just defaults
	setLocalTimer(TRIGGERACCELSAMP,tankInit.accelsampint,MILLISECS);

	/* set up the first job once we have signal to go and get the time 
	 *	from the server. response is processed in main task loop below 
	 */
	networktime.secs=0;
	networktime.usecs=0;
	networktime.localMicroSecs=0;
	timesync();

}//end setup


/* routine to wait on cell signal */
/* and init memory mgr and queues */
void
setupSockets(){
	unsigned char setupseq;
	unsigned char *frameptr;
	bool blinkled;

	blinkled=false;

	setupseq=0;
	setLocalTimer(WAITTIME,100,MILLISECS);

	digitalWrite(errorPin, HIGH);
	/* wait for radio service */
	/* add wifi in here when we add the hardware */
	while(!cell_avail){

		if(timerExpired(WAITTIME)){

			/* blink the green led at every 5 second poll */
			if(blinkled){
				digitalWrite(errorPin, LOW);
				blinkled=false;
			}
			else{
				digitalWrite(errorPin, HIGH);
				blinkled=true;
			}

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
				Serial.println(F("No Frames Found waiting for cell_avail")) ;
				hdwreset();
			}
			setLocalTimer(WAITTIME,5000,MILLISECS);
		}
	}
	digitalWrite(errorPin, HIGH);
	
	/* just to make sure all our packets came back and no poison pill is hanging
         * around waiting to crash in on the traffic
         */
	Serial.print(F("stats:"));
	Serial.println(statframes);
	Serial.print(F("acks:"));
	Serial.println(ackframes);

	memsetup();	//setup memory manager
	//dumpmem();	//dump memory to screen

	/* initialze the queues in memmgr for sending packets and accelerometer */
	/* if accel event occurs,  whole list is placed on sendq */
	initList(&sendqueue);	/* the queue for packets to be sent */
	initList(&accelqueue);	/* backward looking accel packets that may be joined
				 * as an entire list to the send queue if a g event occurs 
				 */

	digitalWrite(errorPin, LOW);
}

/*continuously entered main loop */
void 
loop() {

	int temp,hum;			//temp and humidity
	static long long pres_accum=0;  //the sum of all the 24 bit samples
	float pres;			//tank pressure 

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

	/******** increments networktime.seconds if microseconds exceed 1000000 *******/
	/* don't need this anymore as it is moved to where samples are taken or to enqueue */
	//updateRealTimeClock();

	/********************* COMM/NETWORK STUFF , do this every loop ***********/
	unsigned char *frameptr;	// local ptr for tracking api mode xbee comm frames

	/* did we lose cell signal? */
	if(!cell_avail){
		recovercell();
	}

	/* any incoming frames from cell interface? */
	/* maybe a cell_avail report? */
	if( (frameptr=recvApiFrame()) != NULL){
		checkReceivedFrames(frameptr);  //lots o comm work gets done in here
	}

	/* any work outstanding on sendUDP ? */
	/* packetpending numbers frames from 1-9 so we always wait on right frame */
	if(packetpending !=0){
		if(timerExpired(PACKETTIMEOUT)){
			Serial.print(F("Lost UDP packet frameid=0x"));
			Serial.println(packetpending,HEX);
			packetpending=0;
		}
	}
	else{
		/* check if need to send, queue, or store some packets */
		if(sendqueue.numelements != 0){
			sendNextQPacket();
		}
		else{
			/* work off any queued backlog on SD card at low priority */
			checkSDqueue();
		}
	}


	/********************* STUFF TO DO EVERY LOOP VERY QUICKLY  ***********/
	//  nothing yet


	
	/********************* STUFF TO DO EVERY accelsampint mS ***********/
	if(timerExpired(TRIGGERACCELSAMP)){
		/* process the accel data */
		process_accelerometer();
	}

	/********************* STUFF TO DO EVERY sampleinterval mS ***********/
	if( timerExpired(TRIGGERTIME) ) {

		//reset trigger for sample
		setLocalTimer(TRIGGERTIME,tankInit.sampleinterval,MILLISECS);

		numsamples++;


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
		
	/****************** STUFF TO DO EVERY SERVER  sample time
	 *	tankInit.secBetween mS -usually seconds  
	 */
	if(timerExpired(TRIGGERSERVER)){

		/* time to send data to server */
		DEB_PRINT(millis());
		DEB_PRINT(":");

		/* convert accumulated 24 bit samples to a calibrated 
		 * float pressure 
		 * slow but only happens every 10 seconds
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

		/* format and queue the sample */
		/* first character D to represent regular data */
		enqueue(&sendqueue,'D',&pres,&tankInit.fill,&temp,&hum); 

		/* reset accumulators and timers */
		numsamples=0;
		pres_accum=0;
		setLocalTimer(TRIGGERSERVER,tankInit.secBetween*1000,MILLISECS);

	}//end triggerserver

	//PONDSCUM TEST
	if(freelistcount != ofreelistcount){
		DEB_PRINT(F("Freelist count: "));
		DEB_PRINTLN(freelistcount);
		ofreelistcount=freelistcount;
	}

}//end loop


/* enqueue a standard type packet 
 * restrictions on compiler make this a mess (use of var args not recommended) 
 * so 4 void * pointers are used to reduce copying data around 
 * and wasting time if C++ constructs are used 
 * variable arrays with a single pointer would have been cleaner,  but once again
 * we are copying stuff around and we don't have the time at 16Mhz and 8K of mem
 */
bool
enqueue(struct elementlist *list,
	char type, const void* arg1, const void* arg2, const void* arg3, const void* arg4)
{
//prototypes
//enqueueD('D',float *pres,int *tankInit.fill,int *temp,int *hum); 
//enqueueA('A',float arrx, float arry, float arrz)
//enqueueC('C',char *msg)
//enqueueL('D',char *msg)

	elementindex mybuf;
	int len;
	struct memelement *enqBufptr;
	struct memelement lbuf;

	mybuf=0;

	/* establish time stamp base for enqueued element */
	updateRealTimeClock();

	/* already queueing to SD? */
	if( qtoSD ){
		enqBufptr=&lbuf;
	}

	/* need to start queueing to sd card? */
	else if( freelistcount < FREELISTLOWATER ){
		//PONDSCUM TEST
		Serial.println(F("Strt SD q"));
		qtoSD=true;
		enqBufptr=&lbuf;
	}

	/* going to queue, any buffers? */
	else if((mybuf=allocMemElement())==0xFF) {
		//should have started writing SD card 
		//before this point
		Serial.println(F("PANIC: Out of buffers"));
		//continue, drop sample, and do nothing till 
		//buffers free up or problem gets corrected
		return(false);
	}

	/* queue it up */
	else{
		enqBufptr=&(elements[mybuf]);
	}

	enqBufptr->type = type;
	/* timestame it */
	enqBufptr->secs=networktime.secs;
	enqBufptr->usecs=networktime.usecs;

	switch(type){
		case 'D':
			enqBufptr->buffer.Ddata.pressure = *((float *)arg1);
			enqBufptr->buffer.Ddata.fills = *((int *)arg2);
			enqBufptr->buffer.Ddata.temp = *((int *)arg3);
			enqBufptr->buffer.Ddata.hum = *((int *)arg4);
			break;

		case 'A':
			enqBufptr->buffer.Adata.arrx = *((float *)arg1);
			enqBufptr->buffer.Adata.arry = *((float *)arg2);
			enqBufptr->buffer.Adata.arrz = *((float *)arg3);
			break;

		case 'L':
		case 'C':
			/* log or cmnd entries can only be MEMCHARBUFFERSIZE (12)
				 chars long incl \0 terminator */
			len=snprintf(enqBufptr->buffer.Cdata.cbuf,
					MEMCHARBUFFERSIZE,
					"%s",(char *)arg1);

			/* exceeded buffer size,  queue up an error message to log */
			if(len >=MEMCHARBUFFERSIZE){
				Serial.println(enqBufptr->buffer.Cdata.cbuf);
				sprintf(enqBufptr->buffer.Cdata.cbuf,"L q str len");
				Serial.println(enqBufptr->buffer.Cdata.cbuf);
			}
			break;
		default:
			len=0;
			break;
	}


	if(qtoSD){
		//set upper bit to say its has been SD queued
		enqBufptr->msgnum = globbufcounter| 0x8000;	
		queuetoSD(enqBufptr);
	}
	else{
		//PONDSCUM TEST
		enqBufptr->msgnum=globbufcounter|0x4000; //set 3rd bit upper nibble to say queued
		appendToList(list,mybuf);
		DEB_PRINTLN(F("reg q"));
	}

	globbufcounter++;
	return(true);
}

int
prepdataC(char *buf, struct memelement *mptr){
	int len;
	len=snprintf(buf,FRAMESIZE,
		"%c %s %x\n",
		mptr->type,
		mptr->buffer.Cdata.cbuf,
		mptr->msgnum
	);
	return(len);
}

int
prepdataD(char *buf, struct memelement *mptr){
	int len;
	struct Ddata_t *dptr;

	dptr=&(mptr->buffer.Ddata);
	len=snprintf(buf,FRAMESIZE,
		"%c %s %s %d.%02d %d %d %d %lx %lx %x\n",
		mptr->type,
		tankInit.deviceId,
		tankInit.deviceReg,
		(int)(dptr->pressure),
		abs(((int)((dptr->pressure)*100))%100),
		dptr->fills,
		dptr->temp,
		dptr->hum,
		mptr->secs,
		mptr->usecs,
		mptr->msgnum
	);
	return(len);
}
int
prepdataA(char *buf, struct memelement *mptr){
	int len;
	struct Adata_t *aptr;

	aptr=&(mptr->buffer.Adata);
	len=snprintf(buf,FRAMESIZE,
		"%c %s %s %d.%02d %d.%02d %d.%02d %lx %lx %x\n",
		mptr->type,
		tankInit.deviceId,
		tankInit.deviceReg,
		(int)(aptr->arrx),
		abs(((int)((aptr->arrx)*100))%100),
		(int)(aptr->arry),
		abs(((int)((aptr->arry)*100))%100),
		(int)(aptr->arrz),
		abs(((int)((aptr->arrz)*100))%100),
		mptr->secs,
		mptr->usecs,
		mptr->msgnum
	);
	return(len);
}


/* send the next packet in the send Q to the server or whatever destination is up
 * there is a very small window between the cell_avail check and the sendUDP here 
 * where we could lose cell service and drop a packet.   It can be fixed via job
 *  tagging and release in check recv but with the current memory struggles,  the 
 *  remote possibility of losing one packet every (usually 10) seconds is not 
 *  worth it right now.  fix in release 3 
 */
bool
sendNextQPacket(){
	elementindex oldestinQ;;
	int len;
	char lbuf[FRAMESIZE];

	/* a packet is pending on cell or wifi */
	/* nothing we can do in here */
	if(packetpending != 0){
		return(false);
	}

	/* send wifi if available */
	if(wifi_avail){
		//a stub for later
		;
	}
	/* if not wifi, send cell if available */
	else if(cell_avail){ 

		/* process the packet on queue */
		oldestinQ=removeFirstElement(&sendqueue);
		
		/* whoops, empty q, should never happen */
		if(oldestinQ == 0xFF)
			return(false);

		len=makefullpacket(&(elements[oldestinQ]),(char *)lbuf);
		freeMemElement(oldestinQ);
		sendUDP(tankInit.xbeeIp,tankInit.xbeePort,(char *)lbuf,len);

		/* if queue is cleared enough, stop sending to SD */
		if(qtoSD && (freelistcount > FREELISTHIGHWATER)){
			//PONDSCUM TEST
			DEB_PRINTLN(F("SD queuing off"));

			qtoSD=false;
			fd_SD.close();
			fd_SDwriteMode=false;

			/* the data will showup next time we have to q data 
			 * as the files are all append mode, but may be way old 
			 * seeting dataONSD causes checkerrs to try and open
			 * every SDCHECK milliseconds 
			 */
			if(fd_SD=SD.open(SDBUFFILE)){
				DEB_PRINTLN(F("read open SD file"));
				fd_open=true;
			}
			else{
				Serial.println(F("Could not open SD card for dequeueing"));
				fd_open=false;
				dataONSD=true;
				setLocalTimer(SDCHECKTIMER,10000,MILLISECS);
				errorProcessor(0);
			}
		}
	}
	else{
		/* no media avail to send,  should be queuing on SD
		 *  if queue gets < FREELISTLOWATER 
		 * and if sendqueue has work, and we are already queueing to SD,
		 * start emptying sendq off to SD as well to free up ram 
		 */
		if(qtoSD && (sendqueue.numelements != 0) && (freelistcount < FREELISTLOWATER) ){
			//if numelements > 0, this shoud never return 0xFF
			oldestinQ=removeFirstElement(&sendqueue);
			elements[oldestinQ].msgnum |= 0x2000;
			DEB_PRINTLN(F("dequeuing to SD"));
			queuetoSD( &(elements[oldestinQ]) );
			freeMemElement(oldestinQ);
		}

		/* if get here and nothing could be done, just return and packet will */
		/* remain on the queue and then end up on SD, queue, or sent next round */
		return(false);
	}

	return(true);
	
}

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
			Serial.println(F("waiting for CR"));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); 
			Serial.println(readResp);

			//PONDSCUM INITIAL SETUP
			//Serial3.write("ATBD0x7\r"); 
			//Serial3.begin(115200);
			
			Serial.println(F("switch to API mode"));
			Serial3.write("ATAP2\r"); 

			memset(readResp,0,sizeof(readResp));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); 
			Serial.println(readResp);

			Serial.println(F("disable remote manager"));
			Serial3.write("ATDO0\r"); 
			memset(readResp,0,sizeof(readResp));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); 
			Serial.println(readResp);

			Serial.println(F("turn on cell status light"));
			Serial3.write("ATD51\r"); 
			memset(readResp,0,sizeof(readResp));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); 
			Serial.println(readResp);

			Serial.println(F("send WR mode"));
			//must wait for OK after WR command before sending anymore characters
			Serial3.write("ATWR\r");
			memset(readResp,0,sizeof(readResp));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); Serial.println(readResp);
			
			Serial.println(F("close command mode"));
			Serial3.write("ATCN\r"); 
			memset(readResp,0,sizeof(readResp));
			Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); 
			Serial.println(readResp);
			delay(3000);
		}
		else if(timerExpired(INITTIMER)){
			setLocalTimer(INITTIMER,5000,MILLISECS);
			errorProcessor(1);
	    	}
	}
}
	  

void
calibaccel(void)
{
	
	int arrx,arry,arrz;
	int i;


	arrx=arry=arrz=0;

	Serial.println(F("Calibrating Accelerometer...."));
	//take 8 samples and average them to get the zero point
	//this changes with orientation of device
	for(i=0;i<8;i++){
		arrx +=  analogRead(pin1);
		delay(2);
		arry += analogRead(pin2);
		delay(2);
		arrz += analogRead(pin3);
		delay(2);
		
	}
	zeroGx=arrx>>3;
	zeroGy=arry>>3;
	zeroGz=arrz>>3;
	Serial.print(F("zeroGx: "));
	Serial.println(zeroGx);
	Serial.print(F("zeroGy: "));
	Serial.println(zeroGy);
	Serial.print(F("zeroGz: "));
	Serial.println(zeroGz);
}

void
process_accelerometer(void){

	float arrx,arry,arrz;
	float mag;
	static bool tracking=false;
	elementindex tmp;
	static int fwdsamples;
	struct memelement *mptr;

	setLocalTimer(TRIGGERACCELSAMP,tankInit.accelsampint,MILLISECS);

	arrx = ((analogRead(pin1) - zeroGx)/scaleX);
	arry = ((analogRead(pin2) - zeroGy)/scaleY);
	arrz = ((analogRead(pin3) - zeroGz)/scaleZ);
	mag= (float)sqrt( sq(arrx) + sq(arry) + sq(arrz) );

	
	/* are we tracking and sending samples */
	if(!tracking){
		updateRealTimeClock();
		/* no, should we be */
		if( (mag > tankInit.maxg) ) {
			//PONDSCUM TEST
			DEB_PRINTLN(F("old ACC 2 q"));
			/* add the last BACKSAMPLES samples accumulated to the send queue */
			appendListToList(&sendqueue,&accelqueue);
			tracking=true;
			enqueue(&sendqueue,'A',&arrx,&arry,&arrz, (void *) NULL);
			fwdsamples=1;
		}
		else{
			/* if we have BACKSAMPLES back samples, and not tracking,
				 just keep removing front, put in new data ,and put at end of list */
			if(accelqueue.numelements >= BACKSAMPLES){
				tmp=removeFirstElement(&accelqueue);
			}
			else if( (freelistcount < FREELISTLOWATER) || 
				(tmp=allocMemElement())==0xFF) {

				/* out of buffers, this is just predata, 
				 * so wrap a shorter predata q till buffers clear up
				 * as sendNext puts them off on SD 
				 * drop on floor till room clears up 
				 */
				if( (tmp=removeFirstElement(&accelqueue)) == 0xFF){
					/* just plain hosed, mem is locked, 
						drop any predata on floor */ 
					Serial.println(F("HOSED!"));
					return;
				}
			}

			/* at this point, we have a buffer from somewhere */
			mptr=&(elements[tmp]);

			mptr->secs=networktime.secs;
			mptr->usecs=networktime.usecs;

			mptr->msgnum=0x1000;

			mptr->type = 'A';
			mptr->buffer.Adata.arrx = arrx;
			mptr->buffer.Adata.arry = arry;
			mptr->buffer.Adata.arrz = arrz;

			appendToList(&accelqueue,tmp);
		}
	}

	/* got an event accumulate post event samples till FWD SAMPLES */
	else{
		if(fwdsamples++ < FWDSAMPLES){
			enqueue(&sendqueue,'A',&arrx,&arry,&arrz, (void *) NULL);
		}
		else
			tracking=false;
	}
			
}


/* read the pressure and convert to float */
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

	struct LocEEprom ee;

	if(pres < tankInit.psiPreFill) {
		tankInit.fillCheck = true;
	}

	if(tankInit.fillCheck && (pres > tankInit.psiPostFill)) {
		tankInit.fillCheck = false;
		EEPROM.get(addr,ee);
		ee.fills++;
		tankInit.fill=ee.fills;
		ee.validflag=0xFEEDBEEF;
		ee.reset1pwr0=0;
		EEPROM.put(addr, ee);
	}
	if(tankInit.fill > tankInit.fillMax) {
		EEPROM.get(addr,ee);
		ee.fills=tankInit.fill = 0;
		ee.validflag=0xFEEDBEEF;
		ee.reset1pwr0=0;
		EEPROM.put(addr, ee);
	}
}


	

/* recover the cell signal if lost 
 * this routine just generates a poll to xbee to see whats going on
 * every CELLRECOVERYTIMER seconds 
 * PONDSCUM eventually,  this should be called instead of waiting for cell_avail
 * in setup in case we have wifi also or want to collect data on SD without a cell 
 * sig ever
 */
void
recovercell()
{
	unsigned char *frameptr;

	/* dont wait for the CELLSTATID frame to return in recovery
	 * checkReceivedFrames is called in loop so cell_avail 
	 * will be reset if cell becomes available
	 * otherwise main loop will take remedial action
	 */
	if( (recovertries == 0) || timerExpired(CELLRECOVERYTIMER)){
		sprintf(spbuf,"%cAI",CELLSTATID);
		frameptr=makeApiFrame(ATCMND, (unsigned char *)spbuf, 3);
		sendApiFrame(frameptr);
		if(recovertries == 0){
			Serial.print(F("*****"));
			Serial.println(F("Recover Cell Signal"));
		}
		else{
			Serial.println(F("In Queue: send num accel num freelistcount"));
			Serial.println(sendqueue.numelements);
			Serial.println(accelqueue.numelements);
			Serial.println(freelistcount);
		}
		recovertries++;
		setLocalTimer(CELLRECOVERYTIMER,RECOVERYINTERVAL,MILLISECS);
	}
}


/* send a UDP frame to server */
/* use fixed FRAMESIZE udp frames for simplicity on both ends */
void
sendUDP(const char *addr,short port, const char *packetdata, int packetlen)
{

	unsigned char udpPacket[FRAMESIZE];
	unsigned int ip[4];
	int i;
	unsigned char *packetptr;
	static int framid=0;

	/* should never ever happen */
	if(packetpending!=0){
		Serial.print(F("PANIC: LOST PACKET #:"));
		Serial.println(packetslost++);
		packetpending=0;
	}


	DEB_PRINTLN(F("SendUDP: "));
	DEB_WRITE(packetdata,packetlen);

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
			Serial.println(F("timeout in wait on char"));
			return(false);  //bad,  timeout
		}
	}
	
	locchar=Serial3.read();

	deb_sprintf(spbuf,"%02X ",locchar);
	DEB_PRINT(spbuf);

	/* frame restart,  whoops reject last frame and this one and start over */
	if(locchar == 0x7e){
		Serial.println(F("Frame restart"));
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
		





/* reset the whole shooting match */
void
hdwreset(){
	struct LocEEprom ee;
	void (*startover)(void)=0;

	Serial.println(F("RESETTING")) ;
	Serial.flush();
	Serial3.flush();
	EEPROM.get(addr,ee);
	ee.reset1pwr0=1;
	EEPROM.put(addr,ee);
	delay(2000);
	startover();  //pull the plug, we are toast
			   //this will reset xbee and 
			   //restart everything
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


	/* maintenance stuff on SD card, usually just two flag checks and out so quick */
	/* fd_open usually not true so quick check */
	if(fd_open && fd_SDwriteMode){
		if(timerExpired(SDFLUSHTIMER)){
			fd_SD.flush();
			//flush the SD buffers to card every 15 secs
			setLocalTimer(SDFLUSHTIMER,15000,MILLISECS); 
		}
	}

	/* we have data stuck on a closed SD card */
	/* and the file is not open */
	/* dataONSD normally not true so quick check */
	else if(dataONSD){
		if(timerExpired(SDCHECKTIMER)){
			if(!qtoSD && !fd_open && !fd_SDwriteMode){
				if(SD.exists(SDBUFFILE)){
					Serial.println(F("stuck data"));
					if(fd_SD=SD.open(SDBUFFILE)){
						fd_open=true;
						dataONSD=false;
						err0=false;
					}
					else{
						Serial.println(F("checkerrs:failed to open buffer file"));
						err0=true;
						setLocalTimer(SDCHECKTIMER,10000,MILLISECS);
					}
				}
				else{
					dataONSD=false;
				}
			}
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
		Serial.println(F("Error 1: unable to communicate with xbee"));
		for(i=0;i<10;i++){
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


/******************  SW realtime clock routines ***************/
/* send a packet to trigger a network time response from server */
/* actual time set is done in checkrecvpacket */
void
timesync()
{
	enqueue(&sendqueue,'C',"TIME?",NULL,NULL,NULL);
}
	


/* this routine works as long as it is called at least once every 70 minutes 
 * which is the rollover for a 32 bit clock in microseconds 
 * called often just before something is timestamped to get the stamp in sync
 * with the sw microsec clock arduino uses 
 */
void
updateRealTimeClock(void)
{
	unsigned long nlocmicros;

	nlocmicros=micros();

	/*elapsed micros since last update (interval), works even if rollover */
	networktime.usecs += (nlocmicros - networktime.localMicroSecs);     
							    
	if(networktime.usecs >= 1000000){
			/* ok, so once a second i do an interger divide,  boo hoo */
			networktime.secs += (networktime.usecs/1000000);
			networktime.usecs= (networktime.usecs%1000000);
	}
	// set up for next interval
	networktime.localMicroSecs=nlocmicros;
}

/* called from checkReceivedFrames on a timesync response  */
void
resynctime(const char *timeptr){
	sscanf(timeptr,"%ld %ld",&networktime.secs,&networktime.usecs);
	networktime.localMicroSecs=micros();
	networktime.usecs &= 0xFFFFFFFC;   //arduino time always ends in 00
	Serial.print(F("Time Synced: "));
	Serial.print(networktime.secs);
	Serial.print(' ');
	Serial.println(networktime.usecs);
}




/* routine to queue full packets to SD card \n separated */
/* these will be fetched and sent later when signal returns */
/* and queue clears */
bool
queuetoSD(struct memelement *mptr){
	int len;
	char lbuf[FRAMESIZE];

	/* file is open for read, close and open for append */
	if( !fd_SDwriteMode ){
		if(fd_open){
			fd_SD.close();
			fd_open=false;
		}
	}
	
	/* is file still open for write */
	if (!fd_open){
		if(fd_SD=SD.open(SDBUFFILE,FILE_WRITE)){
			DEB_PRINTLN(F("open SD wrt"));
			fd_open=true;
			fd_SDwriteMode=true;
			setLocalTimer(SDFLUSHTIMER,15000,MILLISECS); 
		}
		else{
			Serial.println(F("Could not open SD card for buffering"));
			errorProcessor(0);
			return(false);
		}

	}

	DEB_PRINT(F("Q 2 SD msgnum: "));
	DEB_PRINTLN(mptr->msgnum,HEX);

	len=makefullpacket(mptr,lbuf);
	fd_SD.write(lbuf,len);
	return(true);
}


/* convert a packet in queue to a packet for network by adding id data */
/* results returned in outbufptr */
int
makefullpacket(struct memelement *mptr,char *outbufptr){
	int len;
	/* what type of packet in queue */
	switch(mptr->type){
		/* normal data packet */
		case 'D':
			len=prepdataD(outbufptr,mptr);
			break;
		/* accelerometer data */
		case 'A':
			len=prepdataA(outbufptr,mptr);
			break;
				
		/* command or log packet to server */
		/* PONDSCUM perhaps a periodic time sync command somewhere */
		case 'C':
		case 'L':
			len=prepdataC(outbufptr,mptr);
			break;

		default:
			//output bin here?
			Serial.print(F("Bad packet in Q type in sendNextQPacket:"));
			Serial.print(mptr->type);
			Serial.println(mptr->msgnum);
			len=snprintf(outbufptr,FRAMESIZE,"L Bad Pck in Q %c %d\n",mptr->type,
				mptr->msgnum);
			break;
	}
	return(len);
}

/* check if any packets in SD card queue file that can now be safely sent up to server */
/*low priority cause they aren't going anywhere 
 * and they are all time stamped.  the main q on the otherhand can
 * overflow back onto SD card again so keep up with it first 
 */
void
checkSDqueue(void){

	if(fd_open && !fd_SDwriteMode){
		if(fd_SD.available()){
			int len;
			len=fd_SD.readBytesUntil('\n',spbuf,sizeof(spbuf));
			spbuf[len]='\0';
			sendUDP(tankInit.xbeeIp,tankInit.xbeePort,spbuf,len);
			DEB_PRINT(F("Send SD queued:"));
			DEB_PRINTLN(spbuf);
		}
		else{
			fd_SD.close();
			fd_open=false;
			dataONSD=false;
			Serial.println(F("end/rem SD Q"));
			SD.remove(SDBUFFILE);
		}
			
	}
}


