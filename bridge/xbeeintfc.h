bool initcomms(char *serialport, unsigned short udpport, bool reset);	//initialize xbee comms
bool modemreset(bool hold);
int xbeeBind(unsigned char socket,unsigned short port);
int xbeeSocket(void);
int sendUDP(unsigned char socket,
	char *addr,
	short port, 
	const char *packetdata,
	 int packetlen);
extern bool cell_avail;
extern int cell_DB;
extern int cell_AI;
void atcmnd(char *cmnd, int nargs, ...);
