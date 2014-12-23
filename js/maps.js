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

	var infowindow = new google.maps.InfoWindow({
<<<<<<< HEAD
	    content:
	    '<div class="container">'
	    	+'<div class="row">'
	    		+'<h3>Ship name</h3>'
	    			+'<p>Este es el remolcador, aqui va una pequeña información. Para mas info, de clic en el boton.'
	    			+'<br><br><button class="btn btn-primary" type="submit">Mas informacion</button>'
	    	+'</div>'
	    +'</div>',
=======
	    content: '<h3>Ship name</h3>'
	    +'<p>Este es el remolcador, aqui va una pequeña información. Para mas info, de clic en el boton.'
	    +'<br><br><button class="btn btn-primary" type="submit">Mas informacion</button>'
	    +'',
>>>>>>> origin/master
  	});

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function(){
		infowindow.open(map, this);
<<<<<<< HEAD
		infowindow.opened = true;
	});
	
	
	google.maps.event.addListener(map, 'click', function(){
		if(infowindow.opened){
			infowindow.close();
			infowindow.opened = false;
		}
	});



=======
	});
	var infowindowopened = false;
	google.maps.event.addListener(infowindow, 'domready', function(){
		if(infowindowopened === false){
			infowindowopened = true;
		}else{
			infowindowopened = false;
		}
	});
	
	google.maps.event.addListener(map, 'click', function(){
		infowindow.close();
	});

>>>>>>> origin/master
  	google.maps.event.addDomListener(window, 'load', initialize);
}