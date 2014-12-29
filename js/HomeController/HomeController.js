function scripts(){
	$.getScript('../js/GetHtml.js'), function(){
		
	}
	$.getScript('../js/Maps.js', function(){
		initialize();
	});
	$.getScript('../js/HomeController/Request.js', function(){
		request();
	});
}