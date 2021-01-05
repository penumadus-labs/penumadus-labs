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





#define DEFHITHRESHOLD 400.0f

//ref: a vehicle at 70mph moves 2 ft in 20ms
//                  35mph moves 1 ft in 20mS
//     or,  a 10 ft vehicle passes the sensor in ? secs at
//                  70mph passes in  97mS
//		    45mph           151mS
//		    35mph           194mS

#define UPTIMEMIN 	6  // 6 *20ms = 120ms = 12ft car at 68mph  
#define UPRISEMIN 	2  // 40mS  to make sure its really up
#define DOWNTIMEMIN	2  // 40mS  make sure its really down
#define INTERVALMIN	2  // 40mS Probably don't need, but lets look for 
			   // 	clearspace between vehicles
#define OVERLAPMIN	2  // if get both mag's high within 2 *20mS of each other call it one car
#define INSANEREM	3000  // if stay in same state for 1 min state machine is insane or someone
				//is parked on bridge

void handleMagData(int id, float magx, float magy, float magz, 
	unsigned long secs, unsigned long usecs);

extern unsigned long carcount;
