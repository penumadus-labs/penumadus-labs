
#define JOURNALFILE "/home/pi/logs/journal"
extern int s_fd;  //the serial port file descriptor

#define BRIDGEID "morganbridge"

#define TICKS 15
#define DEFLTDEFLECTSEND 2

#define MAXRETRY 3

#define REM0PORT 3333
#define REM1PORT 3334
#define REM2PORT 3335
#define BIGBUF 2048

extern int transmitSocket;

struct tempdata {
	char *serno; 
	float temp_humid;
};

#define T0 0
#define T1 1
#define T2 2
#define T3 3
#define T4 4
#define T5 5
#define T6 6
#define T7 7
#define AMB 8
#define HUMIDITY 9

bool sendData(unsigned char *data);

typedef struct { float x; float y; float z; } vect;
struct remdata {
	unsigned long millis;
	vect accel;
	vect mag;
	vect gyro;
};

extern int msgnum;
