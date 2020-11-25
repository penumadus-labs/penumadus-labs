extern int s_fd;			//file descriptor for serial port
char *readUntilCR(void);
void sendApiFrame(unsigned char *frame, int serialPort);
void makeApiFrame(char frameType, 
			unsigned char *data, 
			short datalen, 
			unsigned char *framebuf);
int portsetup(unsigned char *);
void printApiFrame(unsigned char *);

//Memory Allocation
#define FRAMESIZE 80		//fixed sized frame to send via udp
#define MAXFRAMEBUF 2*FRAMESIZE  //frame size for xbee protocol which is udp + overhead so dbl it


//Protocol TIMERS and TIMEOUTS
#define SENDUDP_TIMEOUT 6000   	//time to wait on UDP packet frame clearance  
				// if it is sent asynchronously, expect checkrecvframe
				// to handle it. All operations in mS


extern pthread_mutex_t udplock;
extern pthread_mutex_t apilock;


