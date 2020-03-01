
/**** CALIBRATION *****/

//adc
const float bitToMicroVolt = 0.12207032;

//accelerometer
const float bitToVolt = 5.000; //mv/bit
//const float zeroGx = 336.5;
//const float zeroGy = 336.0;
//const float zeroGz = 336.5;

//these are not constant anymore so we can do autocalibration
//storage allocation in header files,  bad practice,  sue me.
int zeroGx = 331.0;
int zeroGy = 332.0;
int zeroGz = 346.0;

const float scaleX = 12.5;
const float scaleY = 13.0;
const float scaleZ = 12.5;

