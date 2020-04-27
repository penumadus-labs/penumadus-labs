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
#define NUMTIMERS 12

/* structures for holding local timers */
enum timertype_t {
	MILLISECS,
	MICROSECS
};
struct {
	enum timertype_t timertype;
	unsigned long basetime;
	unsigned long interval;
} localTimers[NUMTIMERS];

