#define PACKETTIMEOUT 0
#define TRIGGERTIME 1
#define INITTIMER 2
#define WAITTIME 3
#define LOCSOCKTIMER 4
#define CHARSTART 5
#define TRIGGERSERVER 6
#define ERRPROC0 7
#define ERRPROC1 8
#define NETWORKTIMESYNC 9
#define CELLRECOVERYTIMER 10
#define SDCHECKTIMER 11
#define SDFLUSHTIMER 12
#define TRIGGERACCELSAMP 13
#define NUMTIMERS 14

/* structures for holding local timers */
enum timertype_t {
	LOC_MILLISECS,
	LOC_MICROSECS
};
struct {
	enum timertype_t timertype;
	unsigned long basetime;
	unsigned long interval;
} localTimers[NUMTIMERS];

