// WORKING RECV COMMAND:
//.\nc64.exe -u -l -p 3335
 
#include <WiFi.h>
#include <WiFiUdp.h>

#include <Adafruit_ADS1015.h>
#include <Adafruit_Sensor.h>

 
 
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
 
Adafruit_ADS1115 ads;  /* Use this for the 16-bit version */

  float humidity;
  float temperature;

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
const char * networkName = "UTK-SCADA";
const char * networkPswd = "hankthetroll";
 
//IP address to send UDP data to:
// either use the ip address of the server or 
// a network broadcast address
const char * udpAddress = "192.168.12.255";

// deflection
const int udpPort = 3335;
 
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
  // Initilize hardware serial:
  Serial.begin(115200);
  
  //Connect to the WiFi network
  connectToWiFi(networkName, networkPswd);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(50);
    Serial.print(".");
  }
  
  udp.begin(WiFi.localIP(),udpPort);
  
  // The ADC input range (or gain) can be changed via the following
  // functions, but be careful never to exceed VDD +0.3V max, or to
  // exceed the upper and lower limits if you adjust the input range!
  // Setting these values incorrectly may destroy your ADC!
  //                                                                ADS1015  ADS1115
  //                                                                -------  -------
   // ads.setGain(GAIN_TWOTHIRDS);  // 2/3x gain +/- 6.144V  1 bit = 3mV      0.1875mV (default)
 ads.setGain(GAIN_ONE);        // 1x gain   +/- 4.096V  1 bit = 2mV      0.125mV
  // ads.setGain(GAIN_TWO);        // 2x gain   +/- 2.048V  1 bit = 1mV      0.0625mV
  // ads.setGain(GAIN_FOUR);       // 4x gain   +/- 1.024V  1 bit = 0.5mV    0.03125mV
  // ads.setGain(GAIN_EIGHT);      // 8x gain   +/- 0.512V  1 bit = 0.25mV   0.015625mV
  // ads.setGain(GAIN_SIXTEEN);    // 16x gain  +/- 0.256V  1 bit = 0.125mV  0.0078125mV
  
  ads.begin();
}

void loop(){
  if (WiFi.status() == WL_CONNECTED) {
    //Send a packet
    // read adc
    uint16_t adcMax = 0;
    uint16_t adcRefMax = 0;
    for (uint8_t reading = 0; reading < 5; reading++) {
      adcMax = max(adcMax, ads.readADC_SingleEnded(0));
      adcRefMax = max(adcRefMax, ads.readADC_SingleEnded(3));
      //delay(20);
    }

    char serialBuf[150];
    requestHumidityAndTemp();




    Serial.printf("%lu, %x, %x, %.2f, %.2f\n", millis(), adcMax, adcRefMax, temperature, humidity);
    udp.beginPacket(udpAddress,udpPort);
    udp.printf("%lu, %x, %x, %.2f, %.2f\n", millis(), adcMax, adcRefMax, temperature, humidity);
    udp.endPacket(); 

      temperature = 0;
      humidity = 0;
} else {
          Serial.println("turned off tuned out dropped off resetting...");
          delay(1000);
         ESP.restart();
}
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
