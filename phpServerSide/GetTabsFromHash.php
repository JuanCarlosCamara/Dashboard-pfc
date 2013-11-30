<?php

	define('__ROOT__', dirname(dirname(__File__)));

	$fileName = $_GET['hash'];

	$fileContent = file_get_contents(__ROOT__."/jsonHashFiles/".$fileName.".json");

	echo $fileContent;
?>