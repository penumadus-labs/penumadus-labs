struct sleeper {
		pthread_cond_t data_avail;	
		pthread_mutex_t data_mutex;	
		unsigned int statcode;
		unsigned char data;
		bool flag;
		int id;
}; 


void newCondVar(struct sleeper *ptr);
int newMutex(pthread_mutex_t *lock);
int sleep_on_status(struct sleeper *convar, unsigned long timesecs);
void kickstatus(struct sleeper *convar);
struct sleeper createsocket_cond, bindsocket_cond, sendUDP_cond;;
