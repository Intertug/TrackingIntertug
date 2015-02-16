function callFunctions() {
    initmap();
}

function initmap() {
    var centro = new google.maps.LatLng(9.024365, -72.913396);
    var opciones = {
        zoom: 4,
        center: centro,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        streetViewControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        panControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        scaleControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_CENTER
        }
    };
    var mapa = new google.maps.Map(document.getElementById("map-canvas"), opciones);
    try {
        getVesselsRequest(setMarkers, mapa);
    } catch (err) {
        console.log(err);
    }
}

function setMarkers(vessels, mapa) {
    vessels = vessels.vessel;
    var markers = [];
    var infowindow = null;
    infowindow = new google.maps.InfoWindow({
        content: ""
    });
    for (i = 0; i < vessels.length; i++) {
        var content = "<h6>" + vessels[i].vesselname + " </h6>"
                + "<b> Velocidad </b>: " + vessels[i].speed + " Nudos<br>"
                + "<b> Fecha </b>: " + vessels[i].gpsdate
                + "<br><br>";
        var position = new google.maps.LatLng(vessels[i].lat, vessels[i].long);
        var marcador = new google.maps.Marker({
            position: position,
            icon: '../imgs/ship.png',
            draggable: false,
            title: vessels[i].vesselname,
            zIndex: 1,
            html: content
        });
        markers[i] = marcador;

        google.maps.event.addListener(marcador, 'mouseover', function () {
            infowindow.setContent(this.html);
            infowindow.open(mapa, this);
        });
        google.maps.event.addListener(marcador, 'mouseout', function () {
            infowindow.close();
        });
    }
    var clusterOptions = {gridSize: 60};
    var mc = new MarkerClusterer(mapa, markers, clusterOptions);
    setInterval(getVesselsRequest, 60000, setMarkers, mapa);
}