function scripts(){
	$.getScript('../js/Maps.js', function(){
		initialize();
	});
	$.getScript('../js/HomeController/Request.js', function(){
		request();
	});

	var entireHtml = 'shipinfo.html'.documentElement.outerHTML;
	console.log(entireHtml);
}