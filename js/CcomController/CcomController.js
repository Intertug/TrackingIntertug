var vesselsMarkers = [], docksMarkers = [], anchorageAreaMarkers = [], mooringAreasMarkers = [], mapa, mc = null;

function ccomRequest() {
    try {
        getCcomRequest(initmap);
        setInterval(getCcomRequest, 60000, setFunctions);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

function initmap(datos) {
    var centro = new google.maps.LatLng(datos.center.lat, datos.center.long);
    var opciones = {
        zoom: parseInt(datos.zoom),
        center: centro,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: true,
        streetViewControl: false,
        scaleControl: true,
        mapTypeControlOptions: {position: google.maps.ControlPosition.LEFT_TOP},
        zoomControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER},
        panControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER},
        scaleControlOptions: {position: google.maps.ControlPosition.BOTTOM_CENTER}
    };
    mapa = new google.maps.Map(document.getElementById("map-canvas"), opciones);
    setFunctions(datos);
    setDocks(datos);
    setAnchorageAreas(datos);
    setMooringAreas(datos);
}

function setFunctions(datos) {
    setVessels(datos);

}

function setVessels(datos) {
    cleanMarkers(vesselsMarkers);
    vessels = datos.vessels.vessel;
    var infowindow = null;
    infowindow = new google.maps.InfoWindow({
        content: ""
    });
    for (var i = 0; i < vessels.length; i++) {
        var content = "<h6>" + vessels[i].vesselname + " </h6>"
                + "<b> Velocidad </b>: " + vessels[i].speed + " Nudos<br>"
                + "<b> Fecha </b>: " + vessels[i].gpsdate
                + "<br><br>";
        var position = new google.maps.LatLng(vessels[i].lat, vessels[i].long);
        vesselsMarkers[i] = new google.maps.Marker({
            position: position,
            icon: '../imgs/' + vessels[i].icon,
            draggable: false,
            title: vessels[i].vesselname,
            zIndex: 2,
            html: content,
            map: mapa
        });

        //vesselsMarkers[i] = marcador;
        google.maps.event.addListener(vesselsMarkers[i], 'mouseover', function () {
            infowindow.setContent(this.html);
            infowindow.open(mapa, this);
        });
        google.maps.event.addListener(vesselsMarkers[i], 'mouseout', function () {
            infowindow.close();
        });
    }
    //var clusterOptions = {gridSize: 60, maxZoom: 0.1};
    //mc = new MarkerClusterer(mapa, vesselsMarkers, clusterOptions);
}

function setDocks(datos) {
    cleanMarkers(docksMarkers);
    docks = datos.docks.dock;
    var infowindow = null;
    infowindow = new google.maps.InfoWindow({
        content: ""
    });
    for (var i = 0; i < docks.length; i++) {
        var content = "<h6>" + docks[i].dockname + " </h6>";
        var position = new google.maps.LatLng(docks[i].lat, docks[i].long);
        var marcador = new google.maps.Marker({
            position: position,
            icon: '../imgs/' + docks[i].icon,
            draggable: false,
            title: docks[i].dockname,
            zIndex: 1,
            html: content,
            map: mapa
        });
        docksMarkers[i] = marcador;
        google.maps.event.addListener(marcador, 'mouseover', function () {
            infowindow.setContent(this.html);
            infowindow.open(mapa, this);
        });
        google.maps.event.addListener(marcador, 'mouseout', function () {
            infowindow.close();
        });
    }
}

function setAnchorageAreas(datos) {
    cleanMarkers(anchorageAreaMarkers);
    anchorageareas = datos.anchorageareas.anchoragearea;
    var infowindow = null;
    infowindow = new google.maps.InfoWindow({
        content: ""
    });
    for (var i = 0; i < anchorageareas.length; i++) {
        var coordenada = new google.maps.LatLng(anchorageareas[i].lat, anchorageareas[i].long);
        var circleOptions = {
            strokeColor: anchorageareas[i].fillcolor,
            strokeOpacity: anchorageareas[i].opacity,
            strokeWeight: 1,
            fillColor: anchorageareas[i].fillcolor,
            fillOpacity: anchorageareas[i].opacity,
            map: mapa,
            center: coordenada,
            html: anchorageareas[i].anchorageareaname,
            radius: parseInt(anchorageareas[i].radius)

        };
        var circle = new google.maps.Circle(circleOptions);
        anchorageAreaMarkers[i] = circle;
        google.maps.event.addListener(circle, 'click', function (event) {
            var point = this.center;
            infowindow.setContent(this.html);
            if (event) {
                point = event.latLng;
            }
            infowindow.setPosition(point);
            infowindow.open(mapa, this);
        });
    }
}

function setMooringAreas(datos) {
    var moorings = datos.mooringareas.mooringarea;
    var infowindow = null;
    infowindow = new google.maps.InfoWindow({
        content: ""
    });
    for (var i = 0; i < moorings.length; i++) {
        arraycoordenadas = [];
        mooringAreasMarkers[i] = {};
        for (var j = 0; j < moorings[i].vertices.length; j++) {
            arraycoordenadas.push(new google.maps.LatLng(moorings[i].vertices[j].lat, moorings[i].vertices[j].long));
        }
        console.log(arraycoordenadas);
        mooringAreasMarkers[i] = new google.maps.Polygon({
            paths: arraycoordenadas,
            strokeColor: moorings[i].fillColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            zIndex: 5,
            fillColor: moorings[i].fillColor,
            fillOpacity: moorings[i].opacity,
            html: moorings[i].mooringareaname,
            map: mapa
        });
        console.log(mooringAreasMarkers[i].map);
        mooringAreasMarkers[i].setMap(mapa);
        console.log(mooringAreasMarkers[i].map);
        google.maps.event.addListener(mooringAreasMarkers[i], 'click', function (event) {
            var point = this.getPath().getAt(0);
            infowindow.setContent(this.html);
            if (event) {
                point = event.latLng;
            }
            infowindow.setPosition(point);
            infowindow.open(mapa);
        });
    }

}

function cleanMarkers(markers) {
    for (var i = 0; i < markers.lenght; i++) {
        markers[i].setMap(null);
        markers[i] = null;
    }
    markers = [];
}