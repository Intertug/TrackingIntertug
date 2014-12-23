function request() {
	xmlhttp = new XMLHttpRequest();
	try{
		xmlhttp.open("GET", "../views/parts.xml", false);
		xmlhttp.send();
	}catch(err){
		document.getElementById("showrequest").innerHTML = err;
	}
	xmlDoc = xmlhttp.responseXML;
	show = xmlDoc.getElementsByTagName('ITEM')[0].childNodes[0].nodeValue;
	if(xmlDoc != null){
		document.getElementById("showrequest").innerHTML = show;
	}else{
		document.getElementById("showrequest").innerHTML = "Nulo";
	}
}