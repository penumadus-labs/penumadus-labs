#define MAXELEMENTS 40
#define EVENTTHRESHOLD 3.5
#define BYTE 256
 
typedef long Vector;

typedef struct
{
  Vector x, y, z;
  float time;
} Data;

typedef struct
{
  unsigned char nextIndex;
  unsigned int packets, sendPackets;
  Data list[BYTE];
} AccelerationPacketQueue;

void handleData(AccelerationPacketQueue *q, Vector x, Vector y, Vector z, float time);
