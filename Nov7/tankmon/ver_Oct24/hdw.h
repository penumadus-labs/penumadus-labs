//hardware definition

//SD card hardware
const uint8_t SD_CS = 28;

//ADC hardware 
const uint8_t csPin = 7;
const uint8_t drdyPin = 6;

//temp sensor hardware 
const uint8_t dhtPin = 2;

//accelerometer hardware
const uint8_t errorPin = 5;
//use the below for the real board
//const uint8_t resetPin = 24;
//use the below for the repaired board
const uint8_t resetPin = 41;
const uint8_t pin1 = 0;       //x axis
const uint8_t pin2 = 11;      //y axis
const uint8_t pin3 = 3;       //z axis
#define dhtType DHT11
