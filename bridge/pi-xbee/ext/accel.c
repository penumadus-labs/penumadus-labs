#include <stdio.h>
#include <math.h>
#include <bool.h>
#include <netcomms.h>
#include <trans.h>
#include <aqueues.h>
 
void sendAsAccel(Data *dptr, char *l_id);

Vector square(Vector value)
{
  return value * value;
}

bool event(Data data)
{
  return sqrtf(square(data.x) + square(data.y) + square(data.z)) >= EVENTTHRESHOLD;
}

void handleData(AccelerationPacketQueue *q, Vector x, Vector y, Vector z, unsigned long secs,
	unsigned long usecs)
{
	Data data = {x, y, z, secs,usecs};

  if (q->sendPackets)
  {
	sendAsAccel(&data,q->id);
	q->sendPackets--;
	return;
  }

  q->list[q->nextIndex++] = data;

  if (q->packets < MAXELEMENTS)
    q->packets++;

  if (event(data))
  {
    q->nextIndex -= q->packets;
    do
    {
      	Data data; 
	data = q->list[q->nextIndex++];
	sendAsAccel(&data,q->id);
    } while (--q->packets);
    q->sendPackets = MAXELEMENTS;
  }
}



void
sendAsAccel(Data *dptr, char *l_id)
{
	char sendBuf[MAXFRAMEBUF];

	/* format the data like an accel packet */
	snprintf(sendBuf,MAXFRAMEBUF,
		"%s %s %.2f %.2f %.2f %lx %lx %x",
		"A",
		l_id,
		dptr->x,
		dptr->y,
		dptr->z,
		dptr->secs,
		dptr->usecs
		);
	/* queue it to be sent by main xmit thread */
	sendData(sendBuf);
}
