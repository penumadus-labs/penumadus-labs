void
rewriteSDIni(void)
{

	const char *filename = "/device.ini";
	SD.remove(filename);
	if(fd_SD=SD.open(filename,FILE_WRITE)){
			//PONDSCUM TEST
			Serial.println(F("for write open SD file"));
			fd_open=true;
			fd_SDwriteMode=true;
			setLocalTimer(SDFLUSHTIMER,15000,LOC_MILLISECS); 
		}
	fd_SD.println(F("[server info]"));
	fd_SD.println(F("server_ip = 18.219.216.145"));
	fd_SD.println(F("server_port = 32159"));
	fd_SD.println(F(" "));
	fd_SD.println(F("[filled def]"));
	fd_SD.println(F("psi_pre_fill = 30"));
	fd_SD.println(F("psi_post_fill = 40"));
	fd_SD.println(F(" "));
	fd_SD.println(F("[sec between]"));
	fd_SD.println(F("sec_between = 10"));
	fd_SD.println(F("samp_interval = 50"));
	fd_SD.println(F(" "));
	fd_SD.println(F("[device id]"));
	fd_SD.println(F("device_id = unit_3"));
	fd_SD.println(F("device_region = car"));
	fd_SD.println(F(" "));
	fd_SD.println(F("[maximum g]"));
	fd_SD.println(F("maximum_g = 3.5"));
	fd_SD.println(F(" "));
	fd_SD.println(F("[fill max]"));
	fd_SD.println(F("fill_max = 20"));
	fd_SD.println(F(" "));
	fd_SD.println(F("[transducer params]"));
	fd_SD.println(F("full_scale = 100"));
	fd_SD.println(F("excitation_voltage = 5.0"));
	fd_SD.println(F("calibration_factor = 3.0"));
	fd_SD.close();
}



void
writeSDIni(void)
{

	const char *filename = "/device.ini";
	SD.remove(filename);
	if(fd_SD=SD.open(filename,FILE_WRITE)){
			//PONDSCUM TEST
			Serial.println(F("for write open SD file"));
			fd_open=true;
			fd_SDwriteMode=true;
			setLocalTimer(SDFLUSHTIMER,15000,LOC_MILLISECS); 
	}
	fd_SD.println(F("[server info]"));
	fd_SD.print(F("server_ip = "));
	fd_SD.println(tankInit.xbeeIp);

	fd_SD.print(F("server_port = "));
	fd_SD.println(tankInit.xbeePort);
	fd_SD.println(F(" "));

	fd_SD.println(F("[filled def]"));
	fd_SD.print(F("psi_pre_fill = "));
	fd_SD.println(tankInit.psiPreFill);

	fd_SD.print(F("psi_post_fill = "));
	fd_SD.println(tankInit.psiPostFill);

	fd_SD.println(F(" "));

	fd_SD.println(F("[sec between]"));

	fd_SD.print(F("sec_between = "));
	fd_SD.println(tankInit.secBetween);

	fd_SD.print(F("samp_interval = "));
	fd_SD.println(tankInit.sampleinterval);

	fd_SD.print(F("accel_interval = "));
	fd_SD.println(tankInit.accelsampint);
	fd_SD.println(F(" "));

	fd_SD.println(F("[device id]"));
	fd_SD.print(F("device_id = "));
	fd_SD.println(tankInit.deviceId);

	fd_SD.println(F("[maximum g]"));
	fd_SD.print(F("maximum_g = "));
	fd_SD.println(tankInit.maxg);

	fd_SD.println(F(" "));

	fd_SD.println(F("[fill max]"));
	fd_SD.print(F("fill_max = "));
	fd_SD.println(tankInit.fillMax);

	fd_SD.println(F(" "));

	fd_SD.println(F("[transducer params]"));
	fd_SD.print(F("full_scale = "));
	fd_SD.println(tankInit.fullScale);

	fd_SD.print(F("excitation_voltage = "));
	fd_SD.println(tankInit.excitation);

	fd_SD.print(F("calibration_factor = "));
	fd_SD.println(tankInit.calFactor);


	fd_SD.close();
}




