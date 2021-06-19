
/*********************************************************
* Network code below this point
* Copyright G. Laggis
* all rights reserved
* used by permission to UTK civil engineering
*********************************************************/

/* notes on WIFI PROCESSING
*1.) WIFI boots and sends a WIFIBOOTED to hank meaning it is up but
        not connected to server or internet
*2.) hank calls check checkwifiavail()
        which sends a command to server via back channel.
        (sendUDPsneaky)
	this informs wifipi of server address 
*3.) wifipi  waits for a response from UDPengine server to query, polls every 
        few seconds
*4.) wifipi sends a WIFIUP to hank once query is successful
*5.) hank wets wifi_avail flag and the sendudp routine uses the serial port
	instead of the serial3 port for sending data
*6.) wifipi can invalidate its connection status at any time if server link
	or wifi fails by sending WIFIDOWN and hank will revert to cell
	a subsequent WIFUP we revalidate.  WIFIBOOTED will only be sent after
        a powerup
*/

int statframes=0;
int ackframes=0;

/* WARNING: this can not be called twice in a row without an
 * intervening sendApiFrame because of static data inside
 * make sure sendApiFrame is called immediately after this 
 * all data is  utilized and buffer free again
 */

/* construct an xbee api frame
 * with checksum and header to send to xbee
 */
unsigned char *
makeApiFrame(char frameType, 
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
sendApiFrame(unsigned char *frame, HardwareSerial *serialPort){
	int i;
	int len;
	int stuffedlen;
	unsigned int sent;
	unsigned char buf[MAXBUFSIZE];

	/* frame to be sent */
	//DEB_PRINT(F("SEND: "));
	//printApiFrame(frame);

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

#ifdef FULL_DEBUG
	DEB_PRINTLN("stuffed buffer");
	for(i=0;i<stuffedlen;i++){
		sprintf(spbuf,"%02X ",buf[i]);
		Serial.print(spbuf);
	}
	DEB_PRINTLN("");
#endif

	sent=serialPort->write(buf,stuffedlen);
	DEB_WRITE("Sent: ",6);
	DEB_PRINTLN(sent);
					
}

/* print a frame based on its internal length */
void
printApiFrame(unsigned char *frame){

	int i;
	int len;

#ifndef LOC_DEBUG
	return;
#endif

	len=((frame[LENHI]&0xFF)<<8)|(frame[LENLO]&0xFF);

#ifdef FULL_DEBUG
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

/* WARNING: this can not be called twice in a row without an
 * intervening checkframes because of static data inside
 * make sure checkframes is called immediately after this and 
 * all data is consumed 
 */
/* if no frame ready, return null, else receive and return it */

unsigned char *
recvApiFrame(HardwareSerial *serialPort)
{
	//static to save stack space from possible multiple 
	//declarations in calling functions
	static unsigned char recv_apiFrame[MAXBUFSIZE];

	bool startframe;
	int i;
	int lenhi, lenlo, len;
	unsigned char retchar;
	int checksum;
	int a;
	
	memset(recv_apiFrame,0,MAXBUFSIZE);
	checksum=0;

	i=0;
	startframe=false;
	while(serialPort->available() > 0){
		a=serialPort->read();

		deb_sprintf(spbuf,"r-%02X ",a);
		DEB_PRINT(spbuf);

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
		if(waitonchar(&retchar,3000,serialPort)){;
			recv_apiFrame[i++]=retchar;
			lenhi=retchar;
		}
		else{
			Serial.println(F("Never got lenhi"));
			return(NULL);
		}
	
		/* next char is len lo */
		if(waitonchar(&retchar,3000,serialPort)){;
			recv_apiFrame[i++]=retchar;
			lenlo=retchar;
		}
		else{
			Serial.println(F("Never got lenlo"));
			return(NULL);
		}

		len=((lenhi&0xFF)<<8)|(lenlo&0xFF);
		checksum=0;
		for(i=FRAMETYPE;i<len+FRAMETYPE+1;i++){
			if(waitonchar(&retchar,3000,serialPort)){;
				recv_apiFrame[i]=retchar;
				checksum+=retchar;
			}
			else{
				Serial.println(F("busted packet"));
				return(NULL);
			}
		}

		if((checksum & 0xFF) != 0xFF){
			Serial.println(F("BAD checksum"));
			Serial.println(checksum,HEX);
			return(NULL);
		}
		else{
			DEB_PRINTLN(F(" "));
			DEB_PRINT(F("RECV:"));
			printApiFrame(recv_apiFrame);
			/* replace checksum with \0 to terminate string */
			recv_apiFrame[i-1]='\0';
			return(recv_apiFrame);
		}
	}
	else
		return(NULL);
}
		

/* monitor the xbee waiting for a particular incoming frameid */
unsigned char *
waitForFrameId(unsigned char frameid, HardwareSerial *serialPort){

	unsigned char *frameptr;
	bool gotframeid;

	gotframeid=false;
	while(!gotframeid){
		setLocalTimer(LOCSOCKTIMER,LOC_SOCKTIMEOUT,LOC_MILLISECS);
		while( (frameptr=recvApiFrame(serialPort)) == NULL){
			if(timerExpired(LOCSOCKTIMER)){
				Serial.println(F("Timeout on waitForFrameId"));
				return(NULL);
			}
		}
		checkReceivedFrames(frameptr);
		if(frameptr[FRAMEID] == frameid){
			gotframeid=true;
		}
		else{
			Serial.println(F("Not ID, Status Frame"));
		}
	}
	return(frameptr);
}



/* all received frames will eventually end up here 
* check their framid's to see what to do with them
* except for AT frame,  check its and AT resp for that one 
*/
void
checkReceivedFrames(unsigned char *frameptr){

	unsigned char *msg;

	switch(frameptr[FRAMETYPE]){
		case ATCMNDRESP:
			DEB_PRINTLN(F("AT resp"));
			/* is upper nibble equal to cellstat ids */
			if((frameptr[FRAMEID]&0xF0)==CELLSTATID){
				ackframes++;
				switch(frameptr[8]){
					case 0x00:
						Serial.println(F("connected/active"));
						digitalWrite(errorPin, LOW);
						cell_avail=true;
						recovertries=0;
						break;
					case 0x22:
						Serial.println(F("registering"));
						cell_avail=false;
						break;
					case 0x23:
						Serial.println(F("connecting"));
						cell_avail=false;
						break;
					default:
						Serial.println(F("Invalid Status"));
						
				}
			}
			else{
				Serial.println(F("ATCMND not recognized"));
			}
			break;

		case MODEMSTATUS:
			Serial.println(F("MODEM Status"));
			switch(frameptr[4]){
				case 0:
					Serial.println(F("Hardware reset or power up"));
					cell_avail=false; 
					break;
				case 1:
					Serial.println(F("Watchdog timer reset"));break;
				case 2:
					Serial.println(F("Registered with cellular network"));
					cell_avail=true;
					break;
				case 3:
					Serial.println(F("Unregistered with cellular network"));
					cell_avail=false;
					break;
				case 0x0E:
					Serial.println(F("Rmt Mgr conn"));break;
				case 0x0F:
					Serial.println(F("Rmt Mgr disc"));break;
				case 0x35:
					Serial.println(F("Cell update started "));break;
				case 0x36:
					Serial.println(F("Cell update failed "));break;
				case 0x37:
					Serial.println(F("Cell update completed "));break;
				case 0x38:
					Serial.println(F("XBee fw update started"));break;
				case 0x39:
					Serial.println(F("XBee fw update failed"));break;
				case 0x3A:
					Serial.println(F("XBee fw update applying"));break;
				default:
					Serial.println(F("Invalid Status"));
				}
			break;

		case SOCKCREATERESP:
			Serial.println(F("SOCKET CREATE  Status"));
			break;

		case APITXREQRESP:
			DEB_PRINTLN(F("TX response"));
			/* is upper nibble equal to cellstat ids */
			if((frameptr[FRAMEID])==packetpending){
				packetpending=0;
			}
			else if((frameptr[FRAMEID]&0xF0)==SNEAKYFRAME){
				DEB_PRINTLN(F("Sneaky Frame"));
			}
			else{
				Serial.print(F("UNSOLICITIED TX RESP: frame 0x"));
				Serial.println(frameptr[FRAMEID],HEX);
				return;	//don't process garbage TXREQRESP
			}

			/* its an APITXREQRESP from UDP or UDPSneaky, process it */
			/* difference is sendUDP is waited on and timed,  UDPSneaky is not */
			/* and can have many outstanding */
			switch(frameptr[FRAMEID+1]){
				//any interface can return success
				case 0x0: 
					DEB_PRINTLN(F("Succesful Transmit"));
					break;

				//these codes are reserved for xbee by spec
				case 0x21: 
					Serial.println(F("Fail xmit to cell network"));
					cell_avail=false;
					packetslost++;
					break;
				case 0x22: 
					Serial.println(F("Not registered to net"));
					packetslost++;
					cell_avail=false;
					break;
				case 0x2c: 
					Serial.println(F("Invalid frame values"));
					packetslost++;
					break;
				case 0x31: 
					//this has to be bad
					Serial.println(F("Internal error"));
					packetslost++;
					hdwreset();
					break;
				case 0x32: 
					//out of sockets,  big problem
					Serial.println(F("Resource error"));
					packetslost++;
					hdwreset();
					break;
				case 0x74: 
					Serial.println(F("Message too long"));
					packetslost++;
					break;
				case 0x76: 
					Serial.println(F("Socket closed,surprise!"));
					packetslost++;
					break;
				case 0x78: 
					Serial.println(F("Invalid UDP port"));
					packetslost++;
					break;
				case 0x79: 
					Serial.println(F("Invalid TCP port"));
					packetslost++;
					break;
				case 0x7A: 
					Serial.println(F("Invalid host address"));
					packetslost++;
					break;
				case 0x7B: 
					Serial.println(F("Invalid data mode"));
					packetslost++;
					break;
				case 0x7C: 
					Serial.println(F("Invalid interface"));
					packetslost++;
					break;
				case 0x7D: 
					Serial.println(F("Interface relay err"));
					packetslost++;
					break;
				case 0x80: 
					Serial.println(F("Connect refused"));
					packetslost++;
					break;
				case 0x81: 
					Serial.println(F("Socket connection lost"));
					packetslost++;
					break;
				case 0x82: 
					Serial.println(F("No server"));
					packetslost++;
					break;
				case 0x83: 
					Serial.println(F("Socket closed"));
					packetslost++;
					break;
				case 0x84: 
					Serial.println(F("Unknown server"));
					packetslost++;
					break;
				case 0x85: 
					//this isn't good either
					packetslost++;
					Serial.println(F("Unknown error"));
					hdwreset();
					break;
				case 0x86: 
					Serial.println(F("Invalid TLS"));
					packetslost++;
					break;

				//this one, code 0x42, is unused by xbee, 
				//put wifi errs under here
				case WIFI_RET_ERR: 
					Serial.println(F("No Wifi!"));
					wifi_avail=false;
					break;

				default:
					Serial.println(F("Invalid Status"));
					packetslost++;
			}

			deb_sprintf(spbuf,"Stats:%d/%d",packetslost,packetstotal);
			DEB_PRINTLN(spbuf);
			break;

		/* this is a 0xB0 frame from XBEE or WIFI 
			as defined in xbee spec
			only thing incoming should be from UDPengine
                        which means check the first character for an
                        an instruction code  and do it*/

		case RECVDATA:
			DEB_PRINTLN(F("Incoming msg"));
			//to account for ip hdr and command code and ' '
			msg=frameptr+14; 
			if(!parsecommand(msg)){
				Serial.println(F("UDP: random recv traffic"));
				Serial.write(frameptr+14,strlen((char *)frameptr+14));
				Serial.println(" ");
			}
			break;

		/* commands direct from wifipi,  not from server via UDP */
		case WIFICMND:
			//to account for header and WIFICMND command code 
			msg=frameptr+FRAMETYPE+1; 
			if(!parsecommand(msg)){
				Serial.println(F("WIFIPI: random recv traffic"));
				Serial.write(msg,strlen((char *)msg));
				Serial.println(" ");
			}
			break;
		default:
			Serial.println(F("random status traffic"));
	}
}


