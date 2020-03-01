
/* implementation of local microsecond and millisecond timers 
 * call setLocalTimer with the timerid, interval, and MILLISECS or MICROSECS 
 * then poll that timer with timerExpired periodically to check it 
 */

/* set up a local timer in the localTimers array*/
void
setLocalTimer(int timerid, unsigned long interval, enum timertype_t timertype){

	if(timertype == LOC_MILLISECS){
		localTimers[timerid].basetime=millis();
	}
	else {
		localTimers[timerid].basetime=micros();
	}

	localTimers[timerid].interval=interval;
	localTimers[timerid].timertype=timertype;
}

/* check a localTimer value, call this routine periodically to see if it expired */
bool
timerExpired(int timerid){

	unsigned long currtimer;

	if(localTimers[timerid].timertype == LOC_MILLISECS)
		currtimer=millis();
	else
		currtimer=micros();

	if((currtimer-localTimers[timerid].basetime)>=localTimers[timerid].interval){
		return(true);	//fire timer
	}
	else
		return(false);
}

