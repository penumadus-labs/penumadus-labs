#include <math.h>
#include <bool.h>
#include <aqueues.h>
 
Vector square(Vector value)
{
  return value * value;
}

bool event(Data data)
{
  return sqrt(square(data.x) + square(data.y) + square(data.z)) >= EVENTTHRESHOLD;
}

void handleData(AccelerationPacketQueue *q, Vector x, Vector y, Vector z, float time)
{
  Data data = {x, y, z, time};

  if (q->sendPackets)
  {
    // send
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
      Data data = q->list[q->nextIndex++];
      // send
    } while (--q->packets);
    q->sendPackets = MAXELEMENTS;
  }
}
