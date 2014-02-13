<?php

	define('__ROOT__', dirname(dirname(__File__)));

	$fileName = hash("md5", (json_encode($_POST) . time()));

	file_put_contents(__ROOT__."/jsonHashFiles/".$fileName.".json", json_encode($_POST));

	echo $fileName;
?>