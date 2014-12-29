function gethtml(url){
	xmlhttp = new XMLHttpRequest();
	try{
		xmlhttp.open("GET", url, false);
		xmlhttp.send();
		return xmlhttp.response;
	}catch(err){
		return err;
	}
}