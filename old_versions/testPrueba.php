<?php
//session_start();
$url = "100.100.100.120/CreateUser.php";
//$url = "http://localhost/gm2/protected/components/obtenerCalculoAhorro.php";
$fields = array(
        'User'=>urlencode('X'),
        'PhoneNumber'=>urlencode('X'),
        'Password'=>urlencode('X'),
);

	$fields_string = "";

//url-ify the data for the POST
foreach($fields as $key=>$value) { 
    $fields_string .= $key.'='.$value.'&'; 
}
rtrim($fields_string,'&');

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_POST,count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);
//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

//execute post
$result = curl_exec($ch);


//print $result;

?>