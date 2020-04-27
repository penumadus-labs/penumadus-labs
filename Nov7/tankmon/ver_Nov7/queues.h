/* amount of memory not used by other program variables to be allocated */
//PONDSCUM TEST
//#define MEMALLOCATED 100
#define MEMALLOCATED 3008

/* size of fixed buffers for user data in lists,  don't exceed! */
#define MEMCHARBUFFERSIZE 16

/* instead of pointers,  use byte indexes to keep memory use down. 
 * not using pointers to save memory (50% overhead versus 12% on 16 byte buffers)
 * rely on compiler to be smart enough to optimize and minimize multiplies
 */
typedef byte elementindex;  


/* the data overlay into memory */
	struct Ddata_t {
		float pressure;
		int fills;	
		int temp;	
		int hum;	
	};
		
		
	struct Adata_t {
		float arrx;
		float arry;
		float arrz;
	};
	
	struct Cdata_t {
		char cbuf[ MEMCHARBUFFERSIZE ]; 
	};

/* singly linked lists acting as  fifos, fwd is index of next fwd element */
/* multiple lists winding through one big mem array of size TOTALLISTELEMENTS */

	struct memelement{
		elementindex fwd;	//forward pointer
		byte type;		//Accel, datanorm, command etc
		short msgnum;		//used for debug, upper bit=1 means its been queued to SD
		union {
			struct Ddata_t Ddata;
			struct Adata_t Adata;
			struct Cdata_t Cdata;
		}buffer;
		unsigned long secs;
		unsigned long usecs;
	};


/* some rules:
 *	   TOTALLISTELEMENTS may be speced as a number or by using remaining memory but
 *		ensure you have enough left for stack.  don't think the 2650 checks 
 * 		stack bounds sanely. in any case BACKSAMPLES<<TOTALLISTELEMENTS<256 and 
 *         FREELISTLOWWATER is good between 2 and 4 or higher but must be <(FREELISTHIGHWATER-2)
 *         FREELISTHIGHWATER must be <(TOTALELEMENTS-BACKSAMPLES)-1 but .8 of this is recommended
 *		this is because accel ties up BACKSAMPLES of the buffers so we only have 
 *		the remainder to operate with
 *	   FWDSAMPLES can be whatever you want as they queue and send as obtained but
 *              be aware this slows things down if the queue gets full and have to start
 *              queuing to SD in real time.
 *	   BACKSAMPLES is the number of samples to hold in memory in case and accelerometer event 
 *		occurs
 */

/* cannot exceed 256 (see above) */
//PONDSCUM TEST
#define TOTALLISTELEMENTS MEMALLOCATED/sizeof(struct memelement)
//#define TOTALLISTELEMENTS 30

/* when get equal or below this number of buffers start queueing to SD card */
#define FREELISTLOWATER 4

/* when get back above this number turn off queueing to SD card */
#define FREELISTHIGHWATER ((int)((TOTALLISTELEMENTS-BACKSAMPLES)*.8))

#define BACKSAMPLES 20	//how many samples to keep in arrears for accel
#define FWDSAMPLES 20	//how many samples to send after an event

/* structure of the linked lists winding through elements memory */
struct elementlist {
		elementindex head;
		elementindex tail;
		byte numelements;
};


#define SDBUFFILE "/SDBUF.TXT"
