#define MAXUDP 1024	//max length of UDP message
#define LOGPATH "."

#define LOCAL_LISTEN_PORT 32157

#define CHARBURST 50	//# of chars to wait on if no work, or 100mS timer
#define MAXFRAMEBUF 2048


extern int s_fd;  //the serial port file descriptor
extern bool led(int);

#define RESTART -2
#define BADCHECKSUM -3

//only for testing
#define TEST_SERVER_ADDR "192.168.12.21"
#define TEST_SERVER_PORT 32159
#define AWS_SERVER_ADDR "18.222.197.43"
#define AWS_SERVER_PORT 32159
