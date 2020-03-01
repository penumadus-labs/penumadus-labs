
struct LocEEprom {
	int fills;
	unsigned long validflag;
	byte reset1pwr0;
};
	
/* address to use in EEPROM, rotate occasionally */
const int addr = 4;


