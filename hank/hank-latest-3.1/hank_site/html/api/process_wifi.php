<?php

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);


    //grab the data
    http_response_code(200);
    $wifi_name = $_POST['wifiName'];
    $wifi_pass = $_POST['wifiPass'];
    
   //old method 
   /* $script = "/var/www/html/cgi-bin/set_wifi.sh";
    $resp1 = array();
    $resp2 = array();
    $return = NULL;
    $return1= NULL;
   
    //get the new network number
    exec("sudo wpa_cli -iwlan0 add_network", $resp1, $return1);	
    echo "network number ". $return1 . " ";

    $script = '/var/www/html/cgi-bin/set_wifi.sh ' .$resp1 . " " . 
        escapeshellarg($wifi_name). " ". escapeshellarg($wifi_pass);
    exec($script,$resp2,$return);

    //debug
    echo var_dump($resp1) . " ";
    echo var_dump($resp2) . " ";
    echo $return1 . " ";
    echo $return;
    */
    
   $return = NULL; 
   $file = "/etc/wpa_supplicant/wpa_supplicant-wlan0.conf";	    
   $wifi_string = 'ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
	    
		    update_config=1
		    country=US

		    network={
			ssid="'.$wifi_name .'"
			psk="' .$wifi_pass .'"
			key_mgmt=WPA-PSK
			}';
	
    $return = file_put_contents($file, $wifi_string. PHP_EOL);
   //send response
   if($return == FALSE){
  	echo json_encode(["sent"=>true, "message"=>"error"]);
   }
   else{
	echo json_encode(["sent"=>true, "message"=>"success"]);
   }
   sleep(3);
   exec('sudo wpa_cli -i wlan0 reconfigure');

    exit;
    
