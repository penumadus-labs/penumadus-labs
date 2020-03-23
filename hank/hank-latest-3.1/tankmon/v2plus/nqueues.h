/* amount of memory not used by other program variables to be allocated */
#define MEMALLOCATED 3000

/* size of fixed buffers for user data in lists,  don't exceed! */
//#define MEMELEMENTDATASIZE 30
//PONDSCUM TEST
#define MEMELEMENTDATASIZE 40

/* instead of pointers,  use byte indexes to keep memory use down. 
 * not using pointers to save memory (50% overhead versus 12% on 16 byte buffers)
 * rely on compiler to be smart enough to optimize and minimize multiplies
 */
typedef byte elementindex;  


/* the data overlay into memory */
	struct Ddata_t {
		float pressure;
		int fills,
		int temp;
		int hum;
	};
		
		
	struct Adata_t {
		float arrx;
		float arry;
		float arrz;
	};
	
	struct Cdata_t {
		char buf[16];
	}

	struct memelement{
		elementindex fwd;	//forward pointer
		byte type;		//Accel, datanorm, command etc
		short msgnum;		//used for debug, upper bit=1 means its been queued to SD
		union {
			struct Ddata_t Ddata;
			struct Adata_t Adata;
			struct Cdata_t Cdata;
		}
	};

/* singly linked lists acting as  fifos, fwd is index of next fwd element */
/* multiple lists winding through one big mem array of size TOTALLISTELEMENTS */
struct memelement {
		elementindex fwd;
		char buffer[MEMELEMENTDATASIZE];
};

/* cannot exceed 256 */
#define TOTALLISTELEMENTS MEMALLOCATED/sizeof(struct memelement)

/* when get equal or below this number of buffers start queueing to SD card */
#define FREELISTLOWATER 2
#define FREELISTHIGHWATER ((int)(TOTALLISTELEMENTS*.8))

/* structure of the linked lists winding through elements memory */
struct elementlist {
		elementindex head;
		elementindex tail;
		byte numelements;
};

//PONDSCUM TEST
#define BACKSAMPLES 20
#define FWDSAMPLES 20

#define SDBUFFILE "/sdbuf.txt"
