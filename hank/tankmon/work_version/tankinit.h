
/********  PARAMETERS READ FROM INI FILE with defaults ***********/
//default values are set here
struct ini_params {
	//char xbeeIp[17] = { 18,219,216,145,0,0,0,0,0,0,0,0,0,0,0,0,0 }; //Ip addr server
	char xbeeIp[17] =  "18.219.216.145"; //Ip addr server
	short xbeePort = 32159;		//the port to use on the server
	int secBetween = 10;		//sample send interval
	int psiPreFill = 20;
	int psiPostFill = 50;
	bool fillCheck = false;
	int fill = 0; 
	int fillMax = 90;
	float maxg = 3.0;
	char deviceId[20] = {'u','n','i','t','_','3',0,0,0,0,0,0,0,0,0,0,0,0,0,0};
	char deviceReg[20] = {'c','a','r',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
	float fullScale = 100.0;
	float excitation = 5.0;
	float calFactor = 3.42;
	unsigned long sampleinterval = 50;  //interval in mS between samples to be averaged
	unsigned long accelsampint = 5;  //interval in mS between samples to be averaged
} tankInit;
		
void getTankInit(const char *filename);  //load tank values from ini file

