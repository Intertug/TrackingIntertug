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
    for (i = 0; i < vessels.length; i++) {
        var position = new google.maps.LatLng(vessels[i].lat, vessels[i].long);
        var marcador = new google.maps.Marker({
            position: position,
            //map: mapa,
            icon: '../imgs/ship.png',
            draggable: false,
            title: vessels[i].vesselname,
            zIndex: 1,
            html: vessels[i].vesselname
        });
        markers[i] = marcador;
    }
    var clusterOptions = {gridSize: 60};
    var mc = new MarkerClusterer(mapa, markers, clusterOptions);
}