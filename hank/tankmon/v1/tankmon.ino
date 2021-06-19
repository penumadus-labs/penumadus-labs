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

/* if millis < triggermillis then add inc uppermillis  gives us an upperlimit of 35 years 
with upperlimt as a byte , add offset to data, do calc for vector g's send every sample and 
check for max g's every loop  */

const int addr = 0;

char spbuf[128]; /* temp buf for sprintfs */

//********  PARAMETERS READ FROM INI FILE **********
struct ini_params {
	int secBetween = 10;
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
} tankInit;
		

void getTankInit(const char *filename);
void process_accelerometer(void);
void output_gs(float value);


//pressure transducer value
float transducerInst;

DHT_Unified dht(dhtPin, dhtType);
Protocentral_ADS1220 adc;

void setup() {


	int i;
	
	const char *filename = "/device.ini";

	tankInit.fill = EEPROM.read(addr); 

	//start the temp and humidity
	dht.begin();
	//PONDSCUM do we need constructor?  or is this redundent
	sensor_t sensor;

	//analogReference(EXTERNAL);
	pinMode(pin1, INPUT);
	pinMode(pin2, INPUT);
	pinMode(pin3, INPUT);

	/* setup special I/O pins */
	pinMode(errorPin, OUTPUT);
	digitalWrite(errorPin, LOW);

	pinMode(resetPin, OUTPUT);
	digitalWrite(resetPin, LOW);
	
	pinMode(csPin, OUTPUT);
	digitalWrite(csPin, HIGH);
	
	pinMode(SD_CS, OUTPUT);
	digitalWrite(SD_CS, HIGH);

	digitalWrite(resetPin, HIGH);
	delay(500);
	digitalWrite(resetPin, LOW);
	delay(2000);

	/* Serial port to talk to XBEE */
	//PONDSCUM reset someday to 9600
	//which is default for new XBEE
	Serial3.begin(115200);

	/* Serial port for Debug */
	Serial.begin(9600);

	/* init the SPI port */
	SPI.begin();

	/* open the SD card for access */
	for(i=0;(i<6) && (!SD.begin(SD_CS)) ;i++){
		char buffer[80];
		sprintf(buffer,"Failed to open SD - attempt: %d\n",i);
		Serial.print(buffer);
		delay(1000);
	}
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

}//end setup



/*continuously entered main loop */
void loop() {

	bool flag;	//loop flag set to false when secsbetween expires

	float totalTime = 0;
	float transducer = 0;
	float transducerAvg;
	float pres;
	int temp,hum;

	/* secsbetween is number of seconds between samples sent
	 *    sampling is done the entire time and averaged before sent
	 */
	int numsamples  = 0;  //number of samples taken during sample set
	float timeDiff; //temp var for diff between init and current time

	Serial.println("looping....");

	flag=true;
	while(flag) {
	    float init = micros();
		
	    process_accelerometer();

	    //offset since we started this sample period
	    timeDiff = micros() - init;
	    //total time sampling in seconds
	    totalTime += (timeDiff/1000000);

	     
	    //this loop seems to take one second worth of samples per 10 second period
	    //and report that as the average for the period? is that right?
	    if(totalTime < 1) {
		numsamples++;
		int32_t output = adc.Read_WaitForData();
		float transducerInst = (2*output*bitToMicroVolt)/64.00; //transducer channel 1 and 0
		//transducerInst = (2*output*bitToMicroVolt)/64.00; //transducer channel 1 and 0
		transducer += transducerInst;
	    } 
	    else if(totalTime > tankInit.secBetween) {
		  flag = false;
	    }

	}//end while flag loop
	
	transducerAvg = transducer/numsamples ;
	pres = (tankInit.fullScale/tankInit.excitation)*(transducerAvg/(tankInit.calFactor*1000)) - 14.62;
	
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

	sensors_event_t event;
	dht.temperature().getEvent(&event);
	temp = event.temperature;
	dht.humidity().getEvent(&event);
	hum = event.relative_humidity;

	sprintf(spbuf,"%s,location=%s pressure=%d.%02d,filled=%d,temp=%d,hum=%d\n",
			tankInit.deviceId,
			tankInit.deviceReg,
			(int)pres,
			abs((int)(pres*100)%100),
			tankInit.fill,
			temp,
			hum
			);
	Serial3.print(spbuf);
	Serial.print(spbuf);
}//end loop

void writeToXbeeMemory(char* xbeeIp, char *xbeePort, int lenIp, int lenPort) {
	char readResp[3];
	bool atComMode = true;
	unsigned long init;

	//have to delay one second or greater, write +++, and idle 1 second or greater
	//to enter command mode
	delay(1010);
	Serial3.write("+++");
	delay(1010);

	init = millis();
	while(atComMode) {
	    if(Serial3.available()) {
		atComMode = false;
		Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); Serial.println(readResp);
		Serial3.write("ATDE"); Serial3.write(xbeePort, lenPort);
		Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); Serial.println(readResp);
		Serial3.write("ATDL"); Serial3.write(xbeeIp, lenIp);
		Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); Serial.println(readResp);

		//must wait for OK after WR command before sending anymore characters
		Serial3.write("ATWR\r");
		Serial3.readBytesUntil('\r', readResp, sizeof(readResp)); Serial.println(readResp);

		//exit cmnd mode and execute with new parameters
		Serial3.write("ATCN\r");
	    } 
	    else if((millis() - init) > 5000) {
	    	errorProcessor(1);
	    }
	}
}
	  
float bitToMicroVoltConv(int32_t bits) {
	return(bits*bitToMicroVolt);
}

void errorProcessor(uint8_t error) {
	if(error == 0) {
	  	while(true) {
	    		digitalWrite(errorPin, HIGH);
	    		delay(125);
	    		digitalWrite(errorPin, LOW);
	    		delay(125);
	    		digitalWrite(errorPin, HIGH);
	    		delay(125);
	    		digitalWrite(errorPin, LOW);
	    		delay(500);
	  	}
	} 
	else if(error == 1) {
	  	while(true) {
	    		digitalWrite(errorPin, HIGH);
	    		delay(125);
	    		digitalWrite(errorPin, LOW);
	    		delay(125);
	    		digitalWrite(errorPin, HIGH);
	    		delay(125);
	    		digitalWrite(errorPin, LOW);
	    		delay(125);
	    		digitalWrite(errorPin, HIGH);
	    		delay(125);
	    		digitalWrite(errorPin, LOW);
	    		delay(125);
	    		digitalWrite(errorPin, HIGH);
	    		delay(125);
	    		digitalWrite(errorPin, LOW);
	    		delay(125);
	  	}
	}
}

void
getTankInit(const char *filename){

	const size_t bufferLen = 80;
	char buffer[bufferLen];
	char xbeeIp[17];
	char xbeePort[10];
	int lenIp;
	int lenPort;

	unsigned int i;
	bool defaultflag;

	defaultflag=false;

	IniFile ini(filename);

	if(!ini.open()) {
		sprintf(buffer,"Ini file: %s does not exist\n",filename);
		Serial.print(buffer);
		errorProcessor(0);
	}

	Serial.println("Ini file exists");  

	if(ini.getValue("server info", "server_ip", buffer, bufferLen)) {
		Serial.println(buffer);
		for(i = 0; i < sizeof(buffer); i++) {
			xbeeIp[i] = buffer[i];
			if(buffer[i] == '\0') {
				xbeeIp[i] = '\r';
				lenIp = i + 1;
				break;
			}
		}
	}
	else{
		Serial.println("Defaulting ip");
	}
		
	
	if(ini.getValue("server info", "server_port", buffer, bufferLen)) {
		Serial.println(buffer);
		for(i = 0; i < sizeof(buffer); i++) {
			xbeePort[i] = buffer[i];
			if(buffer[i] == '\0') {
				xbeePort[i] = '\r';
				lenPort = i + 1;
				break;
			}
		}
	}
	else{
		Serial.println("Defaulting Port");
	}

	writeToXbeeMemory(xbeeIp, xbeePort, lenIp, lenPort);

	if(!ini.getValue("filled def", "psi_pre_fill", buffer, bufferLen, tankInit.psiPreFill)) {
		defaultflag=true;
	}
	Serial.println(tankInit.psiPreFill);

	if(!ini.getValue("filled def", "psi_post_fill", buffer, bufferLen, tankInit.psiPostFill)) {
		defaultflag=true;
	}
	Serial.println(tankInit.psiPostFill);

	if(!ini.getValue("sec between", "sec_between", buffer, bufferLen, tankInit.secBetween)) {
		defaultflag=true;
	}
	Serial.println(tankInit.secBetween);

	if(!ini.getValue("maximum g", "maximum_g", buffer, bufferLen, tankInit.maxg)) {
		defaultflag=true;
	}
	Serial.println(tankInit.maxg);  

	if(!ini.getValue("fill max", "fill_max", buffer, bufferLen, tankInit.fillMax)) {
		defaultflag=true;
	}
	Serial.println(tankInit.fillMax);

	if(ini.getValue("device id", "device_id", buffer, bufferLen)) {
		//PONDSCUM why not bufferLen?
		for(i = 0; (i < sizeof(buffer)) && (buffer[i] != '\0'); i++) {
			tankInit.deviceId[i] = buffer[i];
		}
		tankInit.deviceId[i] = '\0';
		Serial.println(tankInit.deviceId);
	}
	else{
		defaultflag=true;
		Serial.println(tankInit.deviceId);
	}

	if(ini.getValue("device id", "device_region", buffer, bufferLen)) {
		for(i = 0; (i < sizeof(buffer)) && (buffer[i] != '\0'); i++) {
			tankInit.deviceReg[i] = buffer[i];
		}
		tankInit.deviceReg[i]='\0';
		Serial.println(tankInit.deviceReg);
	}
	else{
		defaultflag=true;
		Serial.println(tankInit.deviceReg);
	}

	if(!ini.getValue("transducer params", "full_scale", buffer, bufferLen, tankInit.fullScale)) {
		defaultflag=true;
	}
	Serial.println(tankInit.fullScale);

	if(!ini.getValue("transducer params", "excitation_voltage", buffer, bufferLen, tankInit.excitation)) {
		defaultflag=true;
	}
	Serial.println(tankInit.excitation);

	if(!ini.getValue("transducer params", "calibration_factor", buffer, bufferLen, tankInit.calFactor)) {
		defaultflag=true;
	}
	Serial.println(tankInit.calFactor);


	if(defaultflag){
		Serial.println("Some Values Have assumed Default Values");
	}

	ini.close();

}


void
process_accelerometer(void){

	int i;
	const int arrSize = 100;
	float arr1[arrSize];
	float arr2[arrSize];
	float arr3[arrSize];
	/* read the accelerometer data */
	for(i = 0; i < arrSize; i++) {
		arr1[i] = ((analogRead(pin1) - zeroGx)/scaleX);
		arr2[i] = ((analogRead(pin2) - zeroGy)/scaleY);
		arr3[i] = ((analogRead(pin3) - zeroGz)/scaleZ);
		if(i == arrSize - 1) {
			for(int i = 0; i < arrSize; i++) {
				if(abs(arr1[0]) < arr1[i]) {
					arr1[0] = arr1[i];
				}
				if(abs(arr2[0]) < arr2[i]) {
					arr2[0] = arr2[i];
				}
				if(abs(arr3[0]) < arr3[i]) {
					arr3[0] = arr3[i];
				}
	  		}

			if(abs(arr1[0]) > tankInit.maxg) {
				output_gs(arr1[0]);
			}

			if(abs(arr2[0]) > tankInit.maxg) {
				output_gs(arr2[0]);
			}

			if(abs(arr3[0]) > tankInit.maxg) {
				output_gs(arr3[0]);
			}

		}//end if i==arrSize-1
	}//end for
}


/* output the g values after an excess */
void
output_gs(float value){
	
	  sprintf(spbuf,"%s,location=%s x_axis=%d.%02d\n",
		tankInit.deviceId,
		tankInit.deviceReg,
		(int)value,
		(int)(value*100)%100);

		  Serial3.print(spbuf);
		  Serial.print(spbuf);
}
