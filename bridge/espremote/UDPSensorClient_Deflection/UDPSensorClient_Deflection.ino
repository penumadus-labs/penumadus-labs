// WORKING RECV COMMAND:
//.\nc64.exe -u -l -p 3335
 
#include <WiFi.h>
#include <WiFiUdp.h>

#include <Adafruit_ADS1015.h>
 
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
 
  WiFi.begin(networkName, networkPswd);
  while (WiFi.status() != WL_CONNECTED) {
    delay(50);
    Serial.print(".");
  }
 
 
  
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
  //only send data when connected
  if(connected){
    //Send a packet

    // read adc
    uint16_t adcMax = 0;
    uint16_t adcRefMax = 0;
    for (uint8_t reading = 0; reading < 5; reading++) {
      adcMax = max(adcMax, ads.readADC_SingleEnded(0));
      adcRefMax = max(adcRefMax, ads.readADC_SingleEnded(3));
      delay(20);
    }
    
    Serial.printf("%lu, %x, %x\n", millis(), adcMax, adcRefMax);
    udp.beginPacket(udpAddress,udpPort);
    udp.printf("%lu, %x, %x\n", millis(), adcMax, adcRefMax);
    udp.endPacket();  
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
          udp.begin(WiFi.localIP(),udpPort);
          connected = true;
          break;
      case ARDUINO_EVENT_WIFI_STA_DISCONNECTED:
          Serial.println("WiFi lost connection, restarting...");
          connected = false;
          delay(1000);
          ESP.restart();
          break;
      default: break;
    }
}
