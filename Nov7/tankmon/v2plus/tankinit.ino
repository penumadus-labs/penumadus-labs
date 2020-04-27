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
		Serial.print(F("Ini file:")); 
		Serial.print(filename);
		Serial.println(F("does not exist"));
		Serial.print(buffer);
		Serial.println(F("Defaults Being Assumed"));
		errorProcessor(0);
	}
	else{
		Serial.println(F("Ini file exists"));  

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
			Serial.println(F("Defaulting Port"));
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

	Serial.print(F("tankInit.xbeeIp"));
	Serial.println(tankInit.xbeeIp);

	Serial.print(F("xbeeport: "));
	Serial.println(tankInit.xbeePort);

	Serial.print(F("tankInit.psiPreFill:"));
	Serial.println(tankInit.psiPreFill);

	Serial.print(F("tankInit.psiPostFill:"));
	Serial.println(tankInit.psiPostFill);

	Serial.print(F("Send Sample Interval (secs): "));
	Serial.println(tankInit.secBetween);

	Serial.print(F("Local Sampling Precision (mS): "));
	Serial.println(tankInit.sampleinterval);

	Serial.print(F("tankInit.maxg:"));  
	Serial.println(tankInit.maxg);  

	Serial.print(F("tankInit.fillMax:"));
	Serial.println(tankInit.fillMax);

	Serial.print(F("tankInit.deviceId:"));
	Serial.println(tankInit.deviceId);

	Serial.print(F("tankInit.deviceReg;"));
	Serial.println(tankInit.deviceReg);

	Serial.print(F("tankInit.fullScale:"));
	Serial.println(tankInit.fullScale);

	Serial.print(F("tankInit.excitation:"));
	Serial.println(tankInit.excitation);

	Serial.print(F("tankInit.calFactor:"));
	Serial.println(tankInit.calFactor);

	if( (tankInit.secBetween * 1000) <= SENDUDP_TIMEOUT ){
		Serial.println(F("WARNING: SENDUDP_TIMEOUT greater than secBetween, packet panic may occur"));
	}

	ini.close();

}
