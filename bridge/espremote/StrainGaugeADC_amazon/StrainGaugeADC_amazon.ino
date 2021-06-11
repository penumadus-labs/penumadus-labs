// WORKING RECV COMMAND:
//.\nc64.exe -u -l -p 3335
 
#include <WiFi.h>
#include <WiFiUdp.h>

#include <Wire.h>
#include <Adafruit_ADS1015.h>

#define DIFFGAIN GAIN_EIGHT
#define DIFFGAINMULT 0.015625 // 8x gain  +/- 0.512V
#define SINGLEGAIN GAIN_TWOTHIRDS
#define SINGLEGAINMULT 0.1875 // two-thirds gain +/- 6.144V

#define MAXREADINGSBEFORECAL 10
 
/*
 * 
 * 
 * 
 * SENSOR SETUP
 * 
 * 
 * 
 * 
 */
 
//both of these are RAW ADC readings to avoid multiplication errors
volatile int16_t g_offset = 0;
volatile int16_t g_lastdiff = 0;

Adafruit_ADS1115 ads;  // 16 bit version, thanks george

int readingsSinceCalibration = 0;
long int millisAtLastReading = 0;
int readingValue = 0;


double results;
double mVexcitation;

void IRAM_ATTR adjoffset() {
  // raw ADC reading in lastdiff copied to g_offset if unstrained
  if ((g_lastdiff-g_offset) < 63) {
   g_offset = g_lastdiff;
  }
}

 float humidity;
  float temperature;
  
/*
 * 
 * 
 * 
 * WIFI SETUP
 * 
 * 
 * 
 * 
 */
 
// WiFi network name and password:
const char * networkName = "ut-open";
const char * networkPswd = "";
 
//IP address to send UDP data to:
// either use the ip address of the server or 
// a network broadcast address
const char * udpAddress = "3.16.142.118";

// george port
const int udpPort = 3338;
 
//Are we currently connected?
boolean connected = false;
//The udp library class
WiFiUDP udp;
/*
 * 
 * 
 * 
 * MAIN SETUP
 * 
 * 
 * 
 * 
 */
 
void setup(){

  Serial.begin(115200);

  pinMode(3, OUTPUT);
  pinMode(6, INPUT);
  attachInterrupt(6, adjoffset, RISING);
  
  //Connect to the WiFi network
  connectToWiFi(networkName, networkPswd);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(50);
    Serial.print(".");
  }
  
  udp.begin(WiFi.localIP(),udpPort);
  
  ads.setGain(DIFFGAIN);
  ads.begin();
}

void loop(){
  if (WiFi.status() == WL_CONNECTED) {
                if (((millis() - millisAtLastReading) > 500) && readingValue == 0) {
                    Serial.println("diff");
                    if (readingsSinceCalibration < MAXREADINGSBEFORECAL) {
                        results = getDiff(false);
                    } else {
                        results = getDiff(true);
                    }
                    millisAtLastReading = millis();
                    readingValue = 1;
                }
                
                if (((millis() - millisAtLastReading) > 500) && readingValue == 1) {
                      Serial.println("exc");
                      mVexcitation = getExcitation();
                      millisAtLastReading = millis();
                      readingValue = 2;
                }
    
    
                if (readingValue == 2) {
                     requestHumidityAndTemp();
                  // both readings have been taken, time to send
                  if (readingsSinceCalibration < MAXREADINGSBEFORECAL || !((g_lastdiff-g_offset) < 63)) {
                      Serial.printf("%lu, D, %.2f, %.2f, %.2f, %.2f, %.2f\n", millis(), (results - g_offset)  * DIFFGAINMULT, mVexcitation, g_offset*DIFFGAINMULT, temperature, humidity);
                      udp.beginPacket(udpAddress,udpPort);
                      udp.printf("%lu, D, %.2f, %.2f, %.2f, %.2f, %.2f\n", millis(), (results - g_offset)  * DIFFGAINMULT, mVexcitation, g_offset*DIFFGAINMULT,  temperature, humidity);
                      udp.endPacket(); 
                  } else if ((g_lastdiff-g_offset) < 63) {
                      // if it's been more than ten readings since last cal, and gauge is under (1 mV) diff, calibrate
                      
                      Serial.printf("%lu, C, %.2f, %.2f, %.2f, %.2f, %.2f\n", millis(), results * DIFFGAINMULT, mVexcitation, 0, temperature, humidity);
                      udp.beginPacket(udpAddress,udpPort);
                      udp.printf("%lu, C, %.2f, %.2f, %.2f, %.2f, %.2f\n", millis(), results * DIFFGAINMULT, mVexcitation, 0, temperature, humidity);
                      udp.endPacket(); 
                     readingsSinceCalibration = 0;
                  }
                  readingValue = 0;
                  readingsSinceCalibration++;
                }
  } else {
          Serial.println("turned off tuned out dropped off resetting...");
          delay(1000);
         ESP.restart();
}
}

double getDiff(bool comp) {
  ads.setGain(DIFFGAIN);
  double reading;
  // if testing for compensation, write 3 HIGH to simulate load
  // do not update global if compensating
  if (comp) {
      digitalWrite(3, HIGH);
      reading = (ads.readADC_Differential_0_1());
      digitalWrite(3, LOW);
  } else {
      digitalWrite(3, LOW);
      g_lastdiff = ads.readADC_Differential_0_1();
      reading = g_lastdiff;
  }
  return reading;
}

double getExcitation() {
    ads.setGain(SINGLEGAIN);
    return ads.readADC_SingleEnded(3) * SINGLEGAINMULT;
}




void connectToWiFi(const char * ssid, const char * pwd){
  Serial.println("Connecting to WiFi network: " + String(ssid));
 
  // delete old config
  WiFi.disconnect(true);
  //register event handler
  WiFi.onEvent(WiFiEvent);
  
  //Initiate connection
  WiFi.begin(ssid, pwd);
  
  Serial.println("Waiting for WIFI connection...");
}
 
//wifi event handler
void WiFiEvent(WiFiEvent_t event){
    switch(event) { 
      case ARDUINO_EVENT_WIFI_STA_GOT_IP:
          //When connected set 
          Serial.print("WiFi connected! IP address: ");
          Serial.println(WiFi.localIP());  
          //initializes the UDP state
          //This initializes the transfer buffer
          break;
      //case ARDUINO_EVENT_WIFI_STA_DISCONNECTED:
      //    Serial.println("ARDUINO_EVENT_WIFI_STA_DISCONNECTED");//, restarting...");
      //    delay(1000);
     //     ESP.restart();
          break;
      //case WL_CONNECTION_LOST:
      //    Serial.println("ARDUINO_EVENT_WIFI_CONNECTION_LOST");
      //    break;
      default: break;
    }
}


void requestHumidityAndTemp() {

  
  Wire.beginTransmission(0x28);   // Begin transmission with given device on I2C bus
  Wire.requestFrom(0x28, 4);      // Request 4 bytes 
  
  // Read the bytes if they are available
  // The first two bytes are humidity the last two are temperature
  if(Wire.available() == 4) {                   
    int b1 = Wire.read();
    int b2 = Wire.read();
    int b3 = Wire.read();
    int b4 = Wire.read();
    
    Wire.endTransmission();           // End transmission and release I2C bus
    
    // combine humidity bytes and calculate humidity
    int rawHumidity = b1 << 8 | b2;
    // compound bitwise to get 14 bit measurement first two bits
    // are status/stall bit (see intro text)
    rawHumidity =  (rawHumidity &= 0x3FFF);
    humidity = 100.0 / pow(2,14) * rawHumidity;
    
    // combine temperature bytes and calculate temperature
    b4 = (b4 >> 2); // Mask away 2 least significant bits see HYT 221 doc
    int rawTemperature = b3 << 6 | b4;
    temperature = 165.0 / pow(2,14) * rawTemperature - 40;
}
}
