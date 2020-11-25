
#define JOURNALFILE "/home/pi/logs/journal"
extern int s_fd;  //the serial port file descriptor
extern bool locdebug;  //the serial port file descriptor

#define BRIDGEID "morganbridge"

#define WEBDATAFILE "/var/www/html/webdata.html"
#define WEBTICKS 10

#define TICKS 15
#define DEFLTDEFLECTSEND 5
#define DEFLECTION_OFFSET 35.0   //offset in mm from zero for deflection mounting

#define MAXRETRY 3

#define REM0PORT 3333
#define REM1PORT 3334
#define REM2PORT 3335
#define BIGBUF 2048

extern int transmitSocket;
extern bool wifi_avail; 
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
extern struct tempdata temps[];

bool sendData(unsigned char *data);

typedef struct { float x; float y; float z; } vect;
struct remdata {
	unsigned long millis;
	vect accel;
	vect mag;
	vect gyro;
};

extern int msgnum;

