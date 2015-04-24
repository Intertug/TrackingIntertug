/* Refactored */

var request = {
    getVesselsPosition: getVesselsPosition()
};

var model = {
    vessels: request.getVesselsPosition.vessels,
    options: request.getVesselsPosition.options
};

var controller = {
    initmap: function () {
        var centro = new google.maps.LatLng(9.024365, -72.913396);
        // var centro = model.options.centro;
        var opciones = {
            zoom: 4,
            center: centro,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControl: true,
            streetViewControl: false,
            scaleControl: true,
            mapTypeControlOptions:
                    {position: google.maps.ControlPosition.LEFT_TOP},
            zoomControlOptions:
                    {position: google.maps.ControlPosition.LEFT_CENTER},
            panControlOptions:
                    {position: google.maps.ControlPosition.LEFT_CENTER},
            scaleControlOptions:
                    {position: google.maps.ControlPosition.BOTTOM_CENTER}
        };
        //var opciones = model.options.opciones;
        views.renderMap(opciones);
    },
    setMarkers: function () {

    },
    getVesselsPosition: function () {

    }
};

var views = {
    renderMap: function (opciones) {
        var mapa = new google.maps.Map(document.getElementById("map-canvas"), opciones);
    }
};


/* Without refactoring. */
var GlobalHome = {
    mapa: null,
    mc: null,
    markers: [],
    templateForHandlebar: $('#vessel-info').html(),
    vessels: {}
};
function initmap() {
    var centro = new google.maps.LatLng(9.024365, -72.913396);
    var opciones = {
        zoom: 4,
        center: centro,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: true,
        streetViewControl: false,
        scaleControl: true,
        mapTypeControlOptions:
                {position: google.maps.ControlPosition.LEFT_TOP},
        zoomControlOptions:
                {position: google.maps.ControlPosition.LEFT_CENTER},
        panControlOptions:
                {position: google.maps.ControlPosition.LEFT_CENTER},
        scaleControlOptions:
                {position: google.maps.ControlPosition.BOTTOM_CENTER}
    };
    GlobalHome.mapa =
            new google.maps.Map(document.getElementById("map-canvas"), opciones);
    callGetVesselsPosition();
}

function callGetVesselsPosition() {
    try {
        var vessels = getVesselsPosition(setMarkers);
        setInterval(getVesselsPosition, 60000, setMarkers);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

function showVesselInfo(datos) {
    var vessel = datos;
    compileHandlebar(vessel);
}

function setMarkers(vessels) {
    if (GlobalHome.mc !== null) {
        GlobalHome.mc.clearMarkers();
    }
    GlobalHome.markers = [];
    GlobalHome.mc = null, vessels = vessels.vessel;
    var infowindow = null;
    infowindow = new google.maps.InfoWindow({
        content: ""
    });
    for (var i = 0, len = vessels.length; i < len; i++) {
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
            html: content,
            id: vessels[i].id
        });
        GlobalHome.markers[i] = marcador;
        google.maps.event.addListener(marcador, 'mouseover', function () {
            infowindow.setContent(this.html);
            infowindow.open(GlobalHome.mapa, this);
        });
        google.maps.event.addListener(marcador, 'mouseout', function () {
            infowindow.close();
        });

        google.maps.event.addListener(marcador, 'click', function () {
            getVessel(showVesselInfo, this.id);
        });
    }
    var clusterOptions = {gridSize: 60, maxZoom: 12};
    GlobalHome.mc =
            new MarkerClusterer(GlobalHome.mapa, GlobalHome.markers, clusterOptions);
}

function compileHandlebar(vessel) {
    var plantilla = Handlebars.compile(GlobalHome.templateForHandlebar);
    var html = plantilla(vessel);
    $('#handlebar-html').html(html);
}