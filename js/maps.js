function initialize() {
	var mapOptions = {
	  center: new google.maps.LatLng(4.397, 0.644),
	  zoom: 4,
	  mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}