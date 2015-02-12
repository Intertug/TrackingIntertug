function initialize() {
    var markers = [];
    var center = new google.maps.LatLng(4.397, -75.644);
    var mapOptions = {
        center: center,
        zoom: 4,
        streetViewControl: false,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    google.maps.InfoWindow.prototype.opened = false;
    var vessels = request();
    for (i = 0; i < vessels - length; i++) {
        var position = new google.maps.LatLng(vessels[i].lat, vessels[i].long);
        markers[i] = new google.maps.Marker({
            position: position,
            map: map,
            title: vessels[i].id

        });
        markers[i].setMap(map);
    }

    google.maps.event.addDomListener(window, 'load', initialize);
}