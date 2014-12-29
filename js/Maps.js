function initialize() {
	var center = new google.maps.LatLng(4.397, -75.644) 
	var mapOptions = {
	  center: center,
	  zoom: 4,
	  streetViewControl: false,
	  scaleControl: true,
	  mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	google.maps.InfoWindow.prototype.opened = false;
	var image = new google.maps.MarkerImage(
	    '../imgs/ship.png',
	    new google.maps.Size(40, 25)
	    //new google.maps.Point(0, 0)
    );
	
	positionMarker = new google.maps.LatLng(10.397, -75.644);
  	var marker = new google.maps.Marker({
	  position: positionMarker,
	  icon: image,
	});

	var image = new google.maps.MarkerImage(
	    '../imgs/ship.png',
	    new google.maps.Size(40, 25)
	    //new google.maps.Point(0, 0)
    );
	
	positionMarker = new google.maps.LatLng(10.397, -75.644);
  	var marker = new google.maps.Marker({
	  position: positionMarker,
	  icon: image,
	});
  	content = gethtml('../views/infowindow.html');
	var infowindow = new google.maps.InfoWindow({
	    content: content,
  	});

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function(){
		infowindow.open(map, this);
		infowindow.opened = true;
	});
	
	
	google.maps.event.addListener(map, 'click', function(){
		if(infowindow.opened){
			infowindow.close();
			infowindow.opened = false;
		}
	});
	
	google.maps.event.addListener(map, 'click', function(){
		infowindow.close();
	});

  	google.maps.event.addDomListener(window, 'load', initialize);
}