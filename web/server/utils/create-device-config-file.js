module.exports = ({ id, port }) =>
  `[server info]
server_ip = ${process.env.SERVER_IP}
server_port = ${port}			
​
[filled def]
psi_pre_fill = 30			
psi_post_fill = 40		
​
[sec between]
sec_between = 10			
samp_interval = 50			
​
[device id]
device_id = ${id}				
device_region = car
​
[maximum g]
maximum_g = 3.5				
​
[fill max]
fill_max = 20				
​
[transducer params]
full_scale = 100			
excitation_voltage = 4.9845		
calibration_factor = 3.41`
