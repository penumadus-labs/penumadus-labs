//#define LOC_DEBUG	//turns on debug prints to console
//#define NOCELL	//makes the unit proceed even if no cell signal

//#define FULL_DEBUG    //turns on huge amounts of debug info for frames

#ifdef LOC_DEBUG
	#define DEB_PRINTLN Serial.println
	#define DEB_PRINT Serial.print
	#define DEB_WRITE Serial.write
	#define deb_sprintf sprintf
#else
	#define DEB_PRINTLN(...)	((void)0)
	#define DEB_PRINT(...)  	((void)0)
	#define DEB_WRITE(...) 		((void)0)
	#define deb_sprintf(...) 	((void)0)
#endif


