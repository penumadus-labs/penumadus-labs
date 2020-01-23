# tankmon
Repository for all code related to tank monitoring 

Meeting Logs:

1/15/20
- tables created in database and viewable in mysql
1/13/20
- On the control panel, there will be options to change parameters, shutdown the unit, repair the SD, and log messages
- For the parameters, these will be inserted directly into the database via SQL statements.
- For soft power down, you'll pass stub the key 'POWER' with 0 for shutdown and 1 for power on
- For SD repair, you'll pass the key 'SDREPAIR' with the value 1 for repair the SD.
- For the control panel, these are the values that need to be changed:
  (ignore after the equals, just the variable names)
  server_ip = 18.219.216.145
  server_port = 32159

  psi_pre_fill = 30
  psi_post_fill = 40

  sec_between = 10
  samp_interval = 50

  device_id = unit_3
  device_region = car
  
  maximum_g = 3.5

  fill_max = 20

  full_scale = 100
  excitation_voltage = 4.9845
  calibration_factor = 3.41 

1/9/20
- Hank will be configured with 2 wifi signals - 1 small unsecured broadcast network for configuration and a second wifi to connect to a larger network.
- Hank needs a wifi antenna 
- Screen will be added on some models. Abram will need to create a “config” landing page to connect to wifi networks
- Caroline needs to put Hank code on git
- Possible hardware change to Legato.

  Caroline:
    - Add hooks into stub code for abram
    - Finalize database design and create tables
    - Source control for code
    - Debug and test wifi code from George  
  Abram:
    - Continue working on layout
    - Add wifi landing page
    - Set up control panel page and graphs
    
12/23/19
- Parse commands on stub
- Fix naming and refactor
- Decide stub protocol


12/13/19
- Target Test Date: 1/15/19
- Need to create wifi protocol 
- Mini screen on hank needs to show: accel data, warnings, connection, pressure readings
- Add soft power down and SD card repair
- Change default units to SI on backend
- Site needs to have a configuration page, shutdown and export to excel

