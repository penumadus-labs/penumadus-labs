<?php
$results = array();
$return = NULL;


//run script to populate file
$script = "/var/www/html/cgi-bin/wifi_gen.sh";
exec($script, $results, $return);

//echo var_dump($results) .  " ";
//echo $return .  "\n";
if($return != 0){
    echo "error";
}

//read the file we made

    //create the file 
    $file="/var/www/html/cgi-bin/wifi_list.txt";
    $fopen = fopen($file, r);

    $fread = fread($fopen,filesize($file));

    fclose($fopen);

    $remove = "\n";

    $split = explode($remove, $fread);

    $array = array();

    foreach ($split as $string)
    {
        $string2 = substr($string, 27);
        $string2 = substr($string2, 0, -1);
        if($string2 != ""){
         array_push($array,$string2);
        }
    }
    //get unique values
    $result = array_unique($array);
    $new_arr = array_values($result);
  
    echo json_encode($new_arr);
    
?>

