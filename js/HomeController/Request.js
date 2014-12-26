function request() {
	xmlhttp = new XMLHttpRequest();
	try{
		xmlhttp.open("GET", "../views/parts.xml", false);
		xmlhttp.send();
	}catch(err){
		document.getElementById("showrequest").innerHTML = err;
	}
	xmlDoc = xmlhttp.responseXML;
	show = xmlDoc.getElementsByTagName('ITEM')[1].childNodes[0].nodeValue;
	if(xmlDoc != null){
		document.getElementById("show").innerHTML = '<span class="glyphicon glyphicon-tag"></span> '+show;
	}else{
		document.getElementById("showrequest").innerHTML = "Nulo";
	}
}