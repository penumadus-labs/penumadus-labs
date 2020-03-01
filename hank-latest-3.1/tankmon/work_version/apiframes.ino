
/*********************************************************
* Network code below this point
* Copyright G. Laggis
* all rights reserved
* used by permission to UTK civil engineering
*********************************************************/


int statframes=0;
int ackframes=0;

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
	DEB_PRINT("SEND: ");
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

#ifdef FULL_DEBUG
	DEB_PRINTLN("stuffed buffer");
	for(i=0;i<stuffedlen;i++){
		sprintf(spbuf,"%02X ",buf[i]);
		Serial.print(spbuf);
	}
	DEB_PRINTLN("");
#endif

	sent=Serial3.write(buf,stuffedlen);
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
		if(waitonchar(&retchar,3000)){;
			recv_apiFrame[i++]=retchar;
			lenhi=retchar;
		}
		else{
			Serial.println(F("Never got lenhi"));
			return(NULL);
		}
	
		/* next char is len lo */
		if(waitonchar(&retchar,3000)){;
			recv_apiFrame[i++]=retchar;
			lenlo=retchar;
		}
		else{
			Serial.println(F("Never got lenlo"));
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
			DEB_PRINTLN(" ");
			DEB_PRINT("RECV:");
			printApiFrame(recv_apiFrame);
			return(recv_apiFrame);
		}
	}
	else
		return(NULL);
}
		

/* monitor the xbee waiting for a particular incoming frameid */
unsigned char *
waitForFrameId(unsigned char frameid){

	unsigned char *frameptr;
	bool gotframeid;

	gotframeid=false;
	while(!gotframeid){
		setLocalTimer(LOCSOCKTIMER,LOC_SOCKTIMEOUT,LOC_MILLISECS);
		while( (frameptr=recvApiFrame()) == NULL){
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

	switch(frameptr[FRAMETYPE]){
		case ATCMNDRESP:
			Serial.println(F("AT resp"));
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
			DEB_PRINTLN(F("TX cmnd response"));
			/* is upper nibble equal to cellstat ids */
			if((frameptr[FRAMEID])==packetpending){
				packetpending=0;
				switch(frameptr[FRAMEID+1]){
					case 0x0: 
						DEB_PRINTLN(F("Succesful Transmit"));
						break;
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
					default:
						Serial.println(F("Invalid Status"));
						packetslost++;
						
				}
			}
			else{
				sprintf(spbuf,
					"TX RESP: frame 0x%02x order",frameptr[FRAMEID]);
				Serial.println(spbuf);
			}

			deb_sprintf(spbuf,"Stats:%d/%d",packetslost,packetstotal);
			DEB_PRINTLN(spbuf);

			break;

		case RECVDATA:
			DEB_PRINTLN(F("Incoming msg"));
			if(strncmp((const char *)(frameptr+14),"<t=",3)==0){
				resynctime((const char *)frameptr+17);
				break;
			}
			Serial.println(F("random recv traffic"));
			break;

		default:
			Serial.println(F("random status traffic"));
	}
}
