
#include <sys/types.h>
#include <stdio.h>      /* for printf() and fprintf() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <errno.h>
#include <sys/fcntl.h>
#include <pthread.h>
#include <sys/socket.h> /* for socket() and bind() */
#include <arpa/inet.h>  /* for sockaddr_in and inet_ntoa() */
#include <semaphore.h>
#include <sys/mman.h>
#include <string.h>     /* for memset() */
#include <unistd.h>     /* for close() */
#include <sys/select.h>
#include <bool.h>

#define TDS 0
#define TURBID 2
#define PH 4
#define SUPPLY 6
#define ID 8

#define TURBIDITYOFFSET 0.32
#define PHOFFSET 0 

int16_t packedToInt16(char *buf, int offset);

int
parsedata(char *incoming, char *outgoing, int size)
{

	int16_t  TDSread;  //Store two bytes from adc
	int16_t  turbidityread;  //Store two bytes from adc
	int16_t  pHread;  //Store two bytes from adc
	int16_t	supplyread; //Test pin tied to 3.3V supply
	int16_t  id;  //Store identifier hard coded into node

	float TDSvoltage;  //Convert adc value to actual voltage
	float TDSvalue;  //Convert TDSvoltage to TDS in ppm

	float turbidityvoltage;  //Convert adc value to actual voltage
	float turbidityvalue; //Convert turbidityvoltage to turbidity in NTU

	float pHvoltage; //Convert adc value to actual voltage
	float pHvalue; //Convert pHvoltage to pH scale

	float supplyvoltage;  //Convert adc value to actual voltage

	char bufi[]={
		0x44,0xd4,
		0x44,0xd4,
		0x44,0xd4,
		0x44,0xd4,
		0x44,0xd4,
		0x44,0xd4,
		0x44,0xd4,
		0x44,0xd4,
		0x44,0xd4
	};
	char bufo[256];

	incoming=bufi;
	outgoing=bufo;

	TDSread=packedToInt16(incoming,TDS);
	TDSvoltage = TDSread * 6.144 / 32767.0;
	TDSvalue = (133.42 * TDSvoltage * TDSvoltage * TDSvoltage - 255.86 * TDSvoltage * TDSvoltage + 857.39 * TDSvoltage) * 0.5;

	turbidityread = packedToInt16(incoming,TURBID);
	turbidityvoltage = turbidityread * 6.144 / 32767.0 - TURBIDITYOFFSET;
  	if (turbidityvoltage < 2.5)
 	{
    	   turbidityvalue = 3000;
 	}
	else
	{
	   turbidityvalue = -1120.4 * (turbidityvoltage) * (turbidityvoltage) + 5742.3 * turbidityvoltage - 4352.9;
	}
	
	pHread = packedToInt16(incoming,PH);
	pHvoltage = pHread * 6.144 / 32767.0;
  	pHvalue = 3.5 * pHvoltage + PHOFFSET;

	supplyread = packedToInt16(incoming,SUPPLY);;

	supplyvoltage = supplyread * 6.144 / 32767.0;
	printf("%f\n",supplyvoltage);

	id = incoming[ID];

	sprintf(outgoing,"Sensor_Readings,TDS=%.0f,Turbidity=%.0f,PH=%.1f,NodeID=%d,Flow=%.1f,Location=UTK,Radiation=test value=1",TDSvalue,turbidityvalue,pHvalue,id,supplyvoltage);
	printf("%s\n",outgoing);
	return(strlen(outgoing));
}

int16_t
packedToInt16(char *buf, int offset)
{
	int16_t tmpint;
	buf+=offset;

	tmpint= ( (*buf)<<8 ) | ( (*(buf+1))&0x00FF);
	return(tmpint);
}
