function request() {
	xmlhttp = new XMLHttpRequest();
	try{
		xmlhttp.open("GET", "../views/parts.xml", false);
		xmlhttp.send();
	}catch(err){
		document.getElementById("showrequest").innerHTML = err;
	}
	xmlDoc = xmlhttp.responseXML;
	if(xmlDoc != null){
		document.getElementById("showrequest").innerHTML = xmlDoc;
	}else{
		document.getElementById("showrequest").innerHTML = "Nulo";
	}
}