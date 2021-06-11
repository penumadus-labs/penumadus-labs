REAL BRIDGE CODE ON BRIDGE IS: UDPSensorClient_Deflection_HYT221 in displacement module and UDPSensorClient_Deflection_OnlyLSM_FINAL in accel/mag sensors.

- StrainGaugeADC_amazon 
	This file is the new 1/4 bridge strain gauge code that sends its data to AWS compositebridge.org socket 3338.
- UDPSensorClient_Deflection
	The remote version that reads deflection only and broadcasts on network 192.168.12.0/24
- UDPSensorClient_Deflection_DHT
	The remote version that reads deflection and temperature with DHT (broken?) abandoned for new high precision sensor
- UDPSensorClient_Deflection_HYT221
	The remote version that reads deflection, temperature, and humidity with HYT221 (currently on bridge) broadcasts on network 192.168.12.0/24
- UDPSensorClient_Deflection_OnlyLSM_FINAL
	The remote version that reads the LSM9DS1 "inertial module" 
