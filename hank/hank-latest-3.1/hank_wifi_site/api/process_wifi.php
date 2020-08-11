<?php

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

//if we have post data

    //grab the data
    http_response_code(200);
    $wifi_name = $_POST['wifiName'];
    $wifi_pass = $_POST['wifiPass'];
    
    $script = "/home/pi/set_wifi.sh";
    $resp1 = array();
    $resp2 = array();
    $return = NULL;

    //get the new network number
    exec("wpa_cli -i wlan0 add_network", $resp1);	
    $script = '/home/caroline/wifi_script.sh ' . $resp1 . " " . 
        escapeshellarg($wifi_name). " ". escapeshellarg($wifi_pass);
    exec($script,$resp2,$return);
    //send response
    
    echo json_encode(["sent"=>true, "message"=>"success"]);
    
