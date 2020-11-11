// WORKING RECV COMMAND:
//.\nc64.exe -u -l -p 3333

#include <WiFi.h>
#include <WiFiUdp.h>
#include <Adafruit_LSM9DS1.h>
#include <Adafruit_Sensor.h>  // not used in this demo but required!

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

// i2c
Adafruit_LSM9DS1 lsm = Adafruit_LSM9DS1();

void setupSensor()
{
  // 1.) Set the accelerometer range
  lsm.setupAccel(lsm.LSM9DS1_ACCELRANGE_2G);
  //lsm.setupAccel(lsm.LSM9DS1_ACCELRANGE_4G);
  //lsm.setupAccel(lsm.LSM9DS1_ACCELRANGE_8G);
  //lsm.setupAccel(lsm.LSM9DS1_ACCELRANGE_16G);
  
  // 2.) Set the magnetometer sensitivity
  lsm.setupMag(lsm.LSM9DS1_MAGGAIN_4GAUSS);
  //lsm.setupMag(lsm.LSM9DS1_MAGGAIN_8GAUSS);
  //lsm.setupMag(lsm.LSM9DS1_MAGGAIN_12GAUSS);
  //lsm.setupMag(lsm.LSM9DS1_MAGGAIN_16GAUSS);

  // 3.) Setup the gyroscope
  lsm.setupGyro(lsm.LSM9DS1_GYROSCALE_245DPS);
  //lsm.setupGyro(lsm.LSM9DS1_GYROSCALE_500DPS);
  //lsm.setupGyro(lsm.LSM9DS1_GYROSCALE_2000DPS);
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
// hank 1
const int udpPort = 3333;
// hank 2
// const int udpPort = 3334;

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


  Serial.println("LSM9DS1 data read demo");
  
  // Try to initialise and warn if we couldn't detect the chip
  if (!lsm.begin())
  {
    Serial.println("Oops ... unable to initialize the LSM9DS1. Check your wiring!");
    while (1);
  }
  Serial.println("Found LSM9DS1 9DOF");

  // helper to just set the default scaling we want, see above!
  setupSensor();
}

void loop(){
  //only send data when connected
  if(connected){
    //Send a packet
    lsm.read();  /* ask it to read in the data */ 

    /* Get a new sensor event */ 
    sensors_event_t a, m, g, temp;
    lsm.getEvent(&a, &m, &g, &temp); 
    
    udp.beginPacket(udpAddress,udpPort);
    udp.printf("%lu,", millis());
    udp.printf("%.4f,%.4f,%.4f,", a.acceleration.x, a.acceleration.y, a.acceleration.z);
    udp.printf("%.4f,%.4f,%.4f,", m.magnetic.x, m.magnetic.y, m.magnetic.z);
    udp.printf("%.4f,%.4f,%.4f\n", g.gyro.x, g.gyro.y, g.gyro.z);
    udp.endPacket();
  }
  //Wait for 20 ms
  delay(20);
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
          Serial.println("WiFi lost connection");
          connected = false;
          delay(1000);
          ESP.restart();
          break;
      default: break;
    }
}
