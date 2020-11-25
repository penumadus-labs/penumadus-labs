#include <stdio.h>
#include <math.h>
#include <time.h>
#include <sys/time.h>
#include <bool.h>
#include <netcomms.h>
#include <trans.h>
#include <magdata.h>
 
/* process magnetometer data 
 *  this is an envelope detector,  when a unit exceeds the threshold
 *  we wait till for a minimum time to validate then wait for the 
 *  threshold to be dropped through again and remain so for a period of
 *  time.   this indicates passage of a vehicle (12ft long, 70mph max,  not hard to figure)
 *  the complication is if car is in middle of bridge and sets off both detectors.   
 * this is a loevent threshold and has to be correlated so we dont' double count.
 */

/*
*             hievent
*             HIDELAYSAMPS
*            *---------*----
*            |             |
*            |             | LODELAYSAMPS
*   ----------             |tt------------------
*state  idle     hievent  eventtimeout  idle
*/


/* notes:  direct hit gives hicount,  passing center gives locount?
 * does other sensor get locount when get direct hit on primary
 * could just divide locount/2 to get cars in centerlane?
 *
 * or just have one threshold and correlate times?
 * or does x/y sensor get bigger hit if off center?
 * need data
 */

typedef enum {
		idle,
		loevent,
		hievent,
		eventhitimeout,
		eventlotimeout,
		} envstate;
		

struct magdata {
		float lothreshold;
		float hithreshold;
		envstate state;
		struct timeval begin;
		struct timeval end;
		int	samples;
		};

struct magdata env[2] = {    
			{ DEFLOTHRESHOLD, DEFHITHRESHOLD, idle, {0,0}, {0,0}, 0 }, 
			{ DEFLOTHRESHOLD, DEFHITHRESHOLD, idle, {0,0}, {0,0}, 0 } 
			};
		

inline float 
vectmag(float x,float y,float z){
		return ( sqrt( (x*x) + (y*y) + (z*z) ) );
}
	

void 
handleMagData(int id, float magx, float magy, float magz, unsigned long secs,
	unsigned long usecs)
{

	char sendBuf[MAXFRAMEBUF];
	float magnitude;

	//print data here to see whats going on with mag sensors
	return;

	magnitude=vectmag(magx,magy,magz);
	env[id].samples++;

	switch ( env[id].state ){

		case idle:
			if( magnitude  > env[id].hithreshold){
				env[id].state=hievent;
				env[id].samples=0;
				env[id].begin.tv_sec=secs;
				env[id].begin.tv_usec=usecs;
			}
			break;


		/* time how long it is continuously high */
		case hievent:
			if( magnitude > env[id].hithreshold ){
				/* 6 samples = 120mS = 12ft car at 68 mph */
				if( env[id].samples > HIDELAYSAMPS ){
					carcount++;
					env[id].state=eventhitimeout;
					env[id].samples=0;
				}
			}
			else{
				env[id].state=idle;
			}
			break;

		/* wait for envelope to go low again for at least two samples */
		case eventhitimeout:
			if( magnitude > env[id].hithreshold ){
				env[id].samples=0;
			}
			else if( env[id].samples > LODELAYSAMPS  ){
				env[id].state=idle;
			}

			break;
				

		default:
			/* should never happen */
			break;
	}


#ifdef MUCHLATER
	snprintf(sendBuf,MAXFRAMEBUF,
		"%s %s %.2f %.2f %.2f %lx %lx %x",
		"A",
		l_id,
		dptr->x,
		dptr->y,
		dptr->z,
		dptr->secs,
		dptr->usecs
		);
	/* queue it to be sent by main xmit thread */
	sendData(sendBuf);
#endif
}
