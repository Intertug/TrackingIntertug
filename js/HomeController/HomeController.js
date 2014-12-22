function scripts(){
	$.getScript('../js/Maps.js', function(){
		initialize();
	});
	$.getScript('../js/Request.js', function(){
		request();
	});
	
}