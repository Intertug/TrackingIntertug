function initialize() {
	var center = new google.maps.LatLng(4.397, 0.644) 
	var mapOptions = {
	  center: center,
	  zoom: 4,
	  streetViewControl: false,
	  scaleControl: true,
	  mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	var infowindow = new google.maps.InfoWindow({
    content: 'Change the zoom level',
    position: center
  	});

  	infowindow.open(map);
  	google.maps.event.addDomListener(window, 'load', initialize);
}