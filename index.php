<?php
	$url = $_SERVER['SERVER_NAME'];
	$subdomain =  strrpos($url, "www.songzify.com");
	if($subdomain === false){

		//Redirect to "www.*"
		header("HTTP/1.1 301 Moved Permanently"); 
		header("Location: http://www.songzify.com"); 
	}
	else {
		echo "url is: " . $url . " (9587204)";
	}
?>