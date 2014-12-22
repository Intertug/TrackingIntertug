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

	var image = new google.maps.MarkerImage(
	    '../imgs/ship.png',
	    new google.maps.Size(100, 100),
	    new google.maps.Point(0, 0)
    );
	
	var infowindow = new google.maps.InfoWindow({
	    content: '<button class="btn btn-default" type="submit">Button</button>',
	    position: center
  	});

  	infowindow.open(map);
  	

  	var marker = new google.maps.Marker({
	  position: new google.maps.LatLng(10.397, -75.644) ,
	  icon: image,
	});

	marker.setMap(map);

  	google.maps.event.addDomListener(window, 'load', initialize);
}