#define MAXELEMENTS 40
#define EVENTTHRESHOLD 3.5
#define BYTE 256
 
typedef float Vector;

typedef struct
{
  Vector x, y, z;
  unsigned long secs;
  unsigned long usecs;
} Data;

typedef struct
{
  char id[64];
  unsigned char nextIndex;
  unsigned int packets, sendPackets;
  Data list[BYTE];
} AccelerationPacketQueue;

void handleData(AccelerationPacketQueue *q, Vector x, Vector y, Vector z, unsigned long secs, 
		unsigned long usecs);
