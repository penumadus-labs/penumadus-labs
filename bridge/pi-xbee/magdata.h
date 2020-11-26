#define DEFLOTHRESHOLD 1.0f
#define DEFHITHRESHOLD 4.0f

/*
*             hievent
*             HIDELAYSAMPS
*            *---------*----
*            |             |
*            |             | LODELAYSAMPS
*   ----------             |tt------------------
*state  idle     hievent  eventtimeout  idle
*/

#define HIDELAYSAMPS 5  // 6 *20ms = 120ms = 12ft car at 68mph  
#define LODELAYSAMPS 2

void handleMagData(int id, float magx, float magy, float magz, 
	unsigned long secs, unsigned long usecs);

extern unsigned long carcount;
