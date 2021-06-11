#define LOGPATH "/home/ubuntu/logs"

#define ERRBUFSZ 1024


extern int errfd;


typedef enum  {
	EXIT,
	NOEXIT
	} EXITSTAT;
	
typedef enum  {
	PERROR,
	NOPERROR
	} PRINTERR;



void g_err( EXITSTAT , PRINTERR , char *fmt, ... );
char *program_path();
char * stamp(void);
pid_t startproc(char *command, int num,...);
volatile unsigned char *init_devmem(long mymaplen, long myoffset);
