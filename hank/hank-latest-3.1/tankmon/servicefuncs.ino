

bool
parsecommand(unsigned char *msg){

	switch(*msg){
		case RESYNCTIME:
			resynctime(msg+2);
			break;

		case SETIPPARAMS:
			/* skip the command and space */
			setipparams(msg+2);
			break;
			
		case GETIPPARAMS:
			getipparams(msg);
			break;

		case SETPARAMS:
			/*+2 gets us to the sub param */
			setparams(msg+2);
			break;
			
		case GETPARAMS:
			/*+2 gets us to the sub param */
			getparams(msg+2);
			break;

		case COMMITPARAMS:
			commitparams(msg);
			break;

		case ERASESD:
			erasesd(msg);
			break;

		case RESETHANK:
			resethank(msg);
			break;

		case SHUTDOWN:
			shutdown(msg);
			break;

		case WIFIBOOTED:
			DEB_PRINTLN(F("Booted"));
			checkwifiavail();
			break;

		case WIFIAVAIL:
			DEB_PRINTLN(F("AVAIL"));
			wifi_avail=true;
			break;

		case WIFIDOWN:
			DEB_PRINTLN(F("DOWN"));
			wifi_avail=false;
			break;

		case 0:
		default:
			DEB_PRINT(F("UNK"));
			DEB_PRINT(F("cmnd 0x"));
			DEB_PRINTLN(*msg);
			return(false);
	}
	return(true);
}

/* called from checkReceivedFrames on a timesync response  */
void
resynctime(unsigned char *timeptr){

	sscanf((char *)timeptr,RESYNCFORMAT_SR,&networktime.secs,&networktime.usecs);
	networktime.localMicroSecs=micros();
	networktime.usecs &= 0xFFFFFFFC;   //arduino time always ends in 00
	Serial.print(F("Time Synced: "));
	Serial.print(networktime.secs);
	Serial.print(' ');
	Serial.println(networktime.usecs);
	time_sync=true;

	sendack(RESYNCTIME,0,ACK);
}


/* direct command for setting ip parameters
   PONDSCUM not a subcommand for no apparent reason 
*/
void
setipparams(unsigned char *msg)
{
sscanf((char *)msg, "%s %hd",
	tankInit.xbeeIp,
	&tankInit.xbeePort
	);

Serial.print(F("IP:PORT="));
Serial.print(tankInit.xbeeIp);
Serial.print(F(":"));
Serial.println(tankInit.xbeePort);
sendack(SETIPPARAMS,0,ACK);

}

/* sub function commands for RECVDATA from server */
void
getipparams(unsigned char *msg)
{
char buf[32];
int n;

DEB_PRINTLN(F("getipparms"));
n=snprintf(buf, sizeof(buf), GETIPFMT_R,
	RESPONSE,
	GETIPPARAMS,
	tankInit.xbeeIp,
	tankInit.xbeePort
	);

sendUDPSneaky(tankInit.xbeeIp,tankInit.xbeePort,buf,n,NULL);

}

void
shutdown(unsigned char *msg)
{

	int n;
	DEB_PRINTLN(F("SHUT DOWN LOOP"));
	if(fd_open){
		fd_SD.flush();
		fd_SD.close();
	}

	Serial3.flush();
	Serial.flush();

	/* hang and blink led really fast */
	setLocalTimer(LOCSOCKTIMER,100,LOC_MILLISECS);
	setLocalTimer(TRIGGERTIME,5000,LOC_MILLISECS);
	while(true){
		if(timerExpired(LOCSOCKTIMER)){
			errorProcessor(2);
			setLocalTimer(LOCSOCKTIMER,100,LOC_MILLISECS);
		}
		if(timerExpired(TRIGGERTIME)){
			setLocalTimer(TRIGGERTIME,5000,LOC_MILLISECS);
			sendack(SHUTDOWN,0,ACK);
		}
		/* keep the serial buffers clear so don't overwrite and crash */
		/* can't close cause need them to send UDP to server */
		n=Serial3.available();
		if(n!=0){
			Serial3.readBytes(spbuf,n);
		}
		n=Serial.available();
		if(n!=0){
			Serial.readBytes(spbuf,n);
		}
	}
}

void 
setparams(unsigned char *msg)
{

	unsigned char cmnd;

	cmnd=*msg;
	msg+=2;

	switch(cmnd){

		case GP_SAMPLEPARAMS:
			Serial.println(tankInit.secBetween);
			sscanf((char *)msg,GP_SAMPLEPARAMSFMT_SR,
				&tankInit.secBetween,	//int secBetween = 10;
				&tankInit.sampleinterval,// sampleinterval = 50;
				&tankInit.accelsampint	// accelsampint = 5;
			);
			Serial.println(tankInit.secBetween);
			sendack(SETPARAMS,GP_SAMPLEPARAMS,ACK);
			break;

		case GP_PRESSPARAMS:
			{
			int fs,ex,cal;
			sscanf((char *)msg,GP_PRESSPARAMSFMT_SR,
				&tankInit.psiPreFill,	//int psiPreFill = 20;
				&tankInit.psiPostFill,	//int psiPostFill = 50;
				&tankInit.fill,		//int fill = 0; 
				&tankInit.fillMax,	//int fillMax = 90;
				&fs,
				&ex,
				&cal
			);
			tankInit.fullScale=fs/GP_PRESSPARAMSFMT_SCALEINT;
			tankInit.excitation=ex/GP_PRESSPARAMSFMT_SCALEINT;
			tankInit.calFactor=cal/GP_PRESSPARAMSFMT_SCALEINT;
			}
			sendack(SETPARAMS,GP_PRESSPARAMS,ACK);
			break;
		case GP_ACCELPARAMS:
			{
			int locint;
			sscanf((char *)msg,GP_ACCELPARAMSFMT_SR,&locint);
			tankInit.maxg=locint/GP_ACCELPARAMSFMT_SCALEINT;
			}
			sendack(SETPARAMS,GP_ACCELPARAMS,ACK);
			break;
		case GP_DEVICEIDPARAM:
			sscanf((char *)msg,GP_DEVICEIDPARAMSFMT_SR,
				tankInit.deviceId	//char deviceId[20]
			);
			sendack(SETPARAMS,GP_DEVICEIDPARAM,ACK);
			break;
	}
}
void 
commitparams(unsigned char *msg)
{
	DEB_PRINTLN(F("COMMIT "));
	if(fd_open){
		fd_SD.flush();
		fd_SD.close();
	}


	writeSDIni();
	fd_SD.flush();
	fd_SD.close();
	sendack(COMMITPARAMS,0,ACK);
	delay(1000);
	Serial3.flush();
	Serial.flush();
	delay(1000);
	hdwreset();	
}

void 
erasesd(unsigned char *msg)
{
	DEB_PRINTLN(F("ERASESD "));
	if(fd_open){
		fd_SD.flush();
		fd_SD.close();
	}

	Serial.print(F("REMOVE "));
	Serial.println(SDBUFFILE);
	SD.remove(SDBUFFILE);

	fd_SD.flush();
	fd_SD.close();
	sendack(ERASESD,0,ACK);
	delay(1000);
	Serial3.flush();
	Serial.flush();
	delay(1000);
	hdwreset();	
}

void 
resethank(unsigned char *msg)
{
	DEB_PRINTLN(F("RESET "));
	if(fd_open){
		fd_SD.flush();
		fd_SD.close();
	}

	sendack(RESETHANK,0,ACK);
	delay(1000);
	Serial3.flush();
	Serial.flush();
	delay(1000);
	hdwreset();	
}

void
getparams(unsigned char *msg)
{
	char buf[MAXBUFSIZE];
	int n;
	char *begin;

	begin=buf;
	*begin++ = 'R';
	*begin++ = ' ';
	*begin++ = 'G';
	*begin++ = ' ';
	*begin++ = *msg;
	*begin++ = ' ';
	n=6;

	switch(*msg){

		case GP_SAMPLEPARAMS:
			n+=snprintf(begin,sizeof(buf)-6,GP_SAMPLEPARAMSFMT_SR,
				tankInit.secBetween,	//int secBetween = 10;
				tankInit.sampleinterval,// int sampleinterval = 50;
				tankInit.accelsampint	// int accelsampint = 5;
			);
			break;

		case GP_PRESSPARAMS:
			{
			int fs,ex,cl;
			fs=(int)(tankInit.fullScale*GP_PRESSPARAMSFMT_SCALEINT+.5);
			ex=(int)(tankInit.excitation*GP_PRESSPARAMSFMT_SCALEINT+.5);
			cl=(int)(tankInit.calFactor*GP_PRESSPARAMSFMT_SCALEINT+.5);

			n+=snprintf(begin,sizeof(buf)-6,GP_PRESSPARAMSFMT_SR,
				tankInit.psiPreFill,	//int psiPreFill = 20;
				tankInit.psiPostFill,	//int psiPostFill = 50;
				tankInit.fill,		//int fill = 0; 
				tankInit.fillMax,	//int fillMax = 90;
				fs,
				ex,	//float excitation = 5.0;
				cl 	//float calFactor = 3.42;
			);
			}
			break;
		case GP_ACCELPARAMS:
			n+=snprintf(begin,sizeof(buf)-6,GP_ACCELPARAMSFMT_SR,
				(int)(tankInit.maxg*GP_ACCELPARAMSFMT_SCALEINT+.5)
			);
			break;
		case GP_DEVICEIDPARAM:
			n+=snprintf(begin,sizeof(buf),GP_DEVICEIDPARAMSFMT_SR,
				tankInit.deviceId	//char deviceId[20]
			);
			break;
		default:
			n=snprintf(buf,sizeof(buf),"L GETPARAM UNK %c",*msg);
			Serial.println(buf);;
			break;
	}

	sendUDPSneaky(tankInit.xbeeIp,tankInit.xbeePort,buf,n,NULL);
}

void
sendack(char commandcode, char subcommandcode, char acknack){
	char buf[32];
	int n;
	if(subcommandcode==0)
		n=sprintf(buf,GEN_RESP_FMT,RESPONSE,commandcode,acknack);
	else
		n=sprintf(buf,GEN_GPRESP_FMT,RESPONSE,commandcode,subcommandcode,acknack,'A');
		
	sendUDPSneaky(tankInit.xbeeIp,tankInit.xbeePort,buf,n,NULL);
}
