var GlobalMarkers = {
    vesselsMarkers: [],
    docksMarkers: [],
    anchorageAreaMarkers: [],
    mooringAreasMarkers: [],
    platformMarkers: [],
};

var GlobalMaps = {
    mapa: null,
    mc: null,
};

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
    GlobalMaps.mapa = new google.maps.Map(document.getElementById("map-canvas"), opciones);
    setVessels(datos);
    setPlatforms(datos);
    setDocks(datos);
    setAnchorageAreas(datos);
    setMooringAreas(datos);
}

function ccomRequest() {
    try {
        getCcomRequest(initmap);
        setInterval(getCcomRequest, 60000, setVessels);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

function setVessels(datos) {
    cleanMarkers(GlobalMarkers.vesselsMarkers);
    var vessels = datos.vessels.vessel;
    var infowindow = null;
    infowindow = new google.maps.InfoWindow({
        content: ""
    });
    var content = "";
    var position = null;
    for (var i = 0, len = vessels.length; i < len; i++) {
        content = "<h6>" + vessels[i].vesselname + " </h6>"
                + "<b> Velocidad </b>: " + vessels[i].speed + " Nudos<br>"
                + "<b> Fecha </b>: " + vessels[i].gpsdate
                + "<br><br>";
        position = new google.maps.LatLng(vessels[i].lat, vessels[i].long);
        GlobalMarkers.vesselsMarkers[i] = new google.maps.Marker({
            position: position,
            icon: '../imgs/' + vessels[i].icon,
            draggable: false,
            title: vessels[i].vesselname,
            zIndex: 2,
            html: content,
            map: GlobalMaps.mapa
        });

        //GlobalMarkers.vesselsMarkers[i] = marcador;
        google.maps.event.addListener(GlobalMarkers.vesselsMarkers[i], 'mouseover', function () {
            infowindow.setContent(this.html);
            infowindow.open(GlobalMaps.mapa, this);
        });
        google.maps.event.addListener(GlobalMarkers.vesselsMarkers[i], 'mouseout', function () {
            infowindow.close();
        });
    }
    //var clusterOptions = {gridSize: 60, maxZoom: 0.1};
    //GlobalMaps.mc = new MarkerClusterer(GlobalMaps.mapa, GlobalMarkers.vesselsMarkers, clusterOptions);
}

function setPlatforms(datos) {
    plataformas = datos.platforms.platform;
    var infowindow = null;
    infowindow = new google.maps.InfoWindow({
        content: ""
    });
    for (var i = 0; i < plataformas.length; i++) {
        var content = "<h6>" + plataformas[i].platformname + " </h6>";
        var position = new google.maps.LatLng(plataformas[i].lat, plataformas[i].long);
        GlobalMarkers.platformMarkers[i] = new google.maps.Marker({
            position: position,
            icon: '../imgs/' + plataformas[i].icon,
            draggable: false,
            title: plataformas[i].platforname,
            zIndex: 1,
            html: content,
            map: GlobalMaps.mapa
        });
        google.maps.event.addListener(GlobalMarkers.platformMarkers[i], 'mouseover', function () {
            infowindow.setContent(this.html);
            infowindow.open(GlobalMaps.mapa, this);
        });
        google.maps.event.addListener(GlobalMarkers.platformMarkers[i], 'mouseout', function () {
            infowindow.close();
        });
    }
}

function setDocks(datos) {
    cleanMarkers(GlobalMarkers.docksMarkers);
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
            map: GlobalMaps.mapa
        });
        GlobalMarkers.docksMarkers[i] = marcador;
        google.maps.event.addListener(marcador, 'mouseover', function () {
            infowindow.setContent(this.html);
            infowindow.open(GlobalMaps.mapa, this);
        });
        google.maps.event.addListener(marcador, 'mouseout', function () {
            infowindow.close();
        });
    }
}

function setAnchorageAreas(datos) {
    cleanMarkers(GlobalMarkers.anchorageAreaMarkers);
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
            map: GlobalMaps.mapa,
            center: coordenada,
            html: anchorageareas[i].anchorageareaname,
            radius: parseInt(anchorageareas[i].radius)

        };
        var circle = new google.maps.Circle(circleOptions);
        GlobalMarkers.anchorageAreaMarkers[i] = circle;
        google.maps.event.addListener(circle, 'click', function (event) {
            var point = this.center;
            infowindow.setContent(this.html);
            if (event) {
                point = event.latLng;
            }
            infowindow.setPosition(point);
            infowindow.open(GlobalMaps.mapa, this);
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
        GlobalMarkers.mooringAreasMarkers[i] = {};
        for (var j = 0; j < moorings[i].vertices.length; j++) {
            arraycoordenadas.push(new google.maps.LatLng(moorings[i].vertices[j].lat, moorings[i].vertices[j].long));
        }
        GlobalMarkers.mooringAreasMarkers[i] = new google.maps.Polygon({
            paths: arraycoordenadas,
            strokeColor: moorings[i].fillColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            zIndex: 5,
            fillColor: moorings[i].fillColor,
            fillOpacity: moorings[i].opacity,
            html: moorings[i].mooringareaname,
            map: GlobalMaps.mapa
        });
        GlobalMarkers.mooringAreasMarkers[i].setMap(GlobalMaps.mapa);
        google.maps.event.addListener(GlobalMarkers.mooringAreasMarkers[i], 'click', function (event) {
            var point = this.getPath().getAt(0);
            infowindow.setContent(this.html);
            if (event) {
                point = event.latLng;
            }
            infowindow.setPosition(point);
            infowindow.open(GlobalMaps.mapa);
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