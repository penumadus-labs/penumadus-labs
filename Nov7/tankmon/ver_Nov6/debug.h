#define LOC_DEBUG	//turns on debug prints to console
//#define FULL_DEBUG

#ifdef LOC_DEBUG
	#define DEB_PRINTLN Serial.println
	#define DEB_PRINT Serial.print
	#define DEB_WRITE Serial.write
	#define deb_sprintf sprintf
#else
	#define DEB_PRINTLN //
	#define DEB_PRINT  //
	#define DEB_WRITE //
	#define deb_sprintf //
#endif

