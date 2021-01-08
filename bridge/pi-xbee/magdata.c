#include <stdio.h>
#include <math.h>
#include <time.h>
#include <sys/time.h>
#include <bool.h>
#include <utils.h>
#include <netcomms.h>
#include <trans.h>
#include <magdata.h>
 
/* process magnetometer data 
 *  this is an envelope detector,  when a unit exceeds the threshold
 *  we wait till for a minimum time to validate then wait for the 
 *  threshold to be dropped through again and remain so for a period of
 *  time.   this indicates passage of a vehicle (12ft long, 70mph max,  not hard to figure)
 *  the complication is if car is in middle of bridge and sets off both detectors.   
 *  in this case,  the overlapping envelopes are detected and counted as one car.  
 *  Counters are all in 20mS/count which is nominal from sensors
 *  
 *  all this can happen in parallel on two different sensor so we have to filter out multi counts.
 */

/*
*             hievent
*             HIDELAYSAMPS
*                  *-------*-------------*---
*                  |||||||||             ||||
*                  |||||||||             ||||
*   ---------------|||||||||-------------||||----------------> EDGEWAIT
*   state: EDGEWAIT UPRISE    UPTIME   DOWNDETECT  INTERVALDELAY
*Interval:         UPRISEMIN UPTIMEMIN DOWNTIMEMIN INTERVALMIN      
* counter:         UPRISECNT UPTIMECNT DOWNTIMECNT INTERVALCNT
*/



typedef enum {
		EDGEWAIT,
		UPRISE,
		UPTIME,
		DOWNDETECT,
		INTERVAL,
		} envstate;


/* counters,  done as indexes so both threads can access each other without complex ptrs */
#define NOCOUNT		-1
#define UPRISECNT 	0
#define UPTIMECNT 	UPRISECNT+1
#define DOWNTIMECNT 	UPRISECNT+2
#define INTERVALCNT	UPRISECNT+3
#define SANITYCNT	UPRISECNT+4
#define NUMCOUNTERS 	5

struct magdata {
		float hithreshold;
		envstate state;
		int counter[NUMCOUNTERS]; 
		struct timeval begin;
		};

struct magdata env[2] = {    
			{ DEFHITHRESHOLD, EDGEWAIT, {0,0,0,0,0}, 0 }, 
			{ DEFHITHRESHOLD, EDGEWAIT, {0,0,0,0,0}, 0 } 
			};
		

static inline float 
vectmag(float x,float y,float z){
		return ( sqrtf( (x*x) + (y*y) + (z*z) ) );
}
	
#define LOCKSTRUC true
#define UNLOCKSTRUC false
void
lockstruct(int id, bool LOCK){
	//so far can't find any reason to lock structs
	//threads only write their own and check each others state
	//counters change before state,  and checks are state before counters
	//leave this as a null function placemark.  
}


/* set the current state of state machine, zero counter, and return other id thread's counter  */
void 
mag_setstate(int id, envstate state, int counter, int value)
{
	//lockstruct(id,LOCKSTRUC);

	//change counter first,  then state
	//in mainline code,  check state first then counter
	if(counter!=NOCOUNT)
		env[id].counter[counter]=value;

	/* reset the sanity counter if state changes so don't get stuck in one state forever */
	if(env[id].state!=state)
		env[id].counter[SANITYCNT]=0;

	env[id].state=state;
	//g_err(NOEXIT,NOPERROR,"Id %d, state: %d, counter %d:%d",id,(int)state,counter,value);

	//lockstruct(id,UNLOCKSTRUC);
}

void 
handleMagData(int id, float magx, float magy, float magz, unsigned long secs,
	unsigned long usecs)
{

	char sendBuf[MAXFRAMEBUF];
	float magnitude;

	if(env[id].counter[SANITYCNT] > INSANEREM){
		//mag_setstate(id,EDGEWAIT,NOCOUNT,0);
		g_err(NOEXIT,NOPERROR,"Rem %d has gone INSANE,\nStuck in state %d",
				id, env[id].state);
		/* nothing really to be done for it,  just warn, reset count, and try again */
		env[id].counter[SANITYCNT] == 0;
	}

	magnitude=vectmag(magx,magy,magz);

	switch ( env[id].state ){

		case EDGEWAIT:
			if( magnitude  > env[id].hithreshold){
				mag_setstate(id,UPRISE,UPRISECNT,0);
				env[id].begin.tv_sec=secs;
				env[id].begin.tv_usec=usecs;
			}

			/* can stay in EDGEWAIT FOREVER and not be insane */
			env[id].counter[SANITYCNT]=0;

			break;


		/* make sure it is really up and not a glitch */
		case UPRISE:
			if( magnitude > env[id].hithreshold ){
				/* 6 samples = 120mS = 12ft car at 68 mph */
				if( env[id].counter[UPRISECNT]++ > UPRISEMIN ){
					// use one cause already had tick since check on rem data
					mag_setstate(id,UPTIME,UPTIMECNT,1);
				}
				
			}
			else
				mag_setstate(id,EDGEWAIT,NOCOUNT,0);

			env[id].counter[SANITYCNT]++;

			break;

		/* measure min envelope width */
		case UPTIME:

			/* is this the first of an UPTIME envelope detected
			 * and the other magnetometer is already in the UP state 
			 * and both magnetometers went up together within a OVERLAP
			 * then this is the same car in middle of road setting off both 
			 */
			if( (env[id].counter[UPTIMECNT] <=1) && 
				(env[(id^1)].state==UPTIME) &&
				     (env[id^1].counter[UPTIMECNT] < OVERLAPMIN) ){
						/* this is the same car in middle of road
						   setting off both */
						mag_setstate(id,DOWNDETECT,DOWNTIMECNT,1);
			}
			else if( magnitude > env[id].hithreshold ){
				if(env[id].counter[UPTIMECNT]++ > UPTIMEMIN){
					mag_setstate(id,DOWNDETECT,DOWNTIMECNT,1);
					/* all criteria fullfilled to call this a car passage */
					carcount++;
				}
			}
			else 
				mag_setstate(id,EDGEWAIT,NOCOUNT,0);

			env[id].counter[SANITYCNT]++;

			break;

		/* wait for envelope to go low again for at least DOWNDETECT samples */ 
		case DOWNDETECT:
			if( magnitude < env[id].hithreshold ){
				if(env[id].counter[DOWNTIMECNT]++ > DOWNTIMEMIN )
					mag_setstate(id,INTERVAL,INTERVALMIN,1);
			}
			else
				mag_setstate(id,DOWNDETECT,DOWNTIMECNT,1);

			env[id].counter[SANITYCNT]++;

			break;
				

		case INTERVAL:
			if( magnitude < env[id].hithreshold ){
				if(env[id].counter[INTERVALCNT]++ > INTERVALMIN )
					mag_setstate(id,EDGEWAIT,NOCOUNT,0);
			}
			else
				mag_setstate(id,INTERVAL,INTERVALMIN,0);

			env[id].counter[SANITYCNT]++;

			break;

		default:
			/* should never happen */
			break;
	}


}
