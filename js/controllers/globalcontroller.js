var request = {
    getVessels: function (callback) {
        getVesselsPosition(callback);
    },
    getVesselInfo: function (callback, id) {
        getVessel(callback, id);
    }
};

var model = {
    vessels: {},
    options: {},
    vessel: {},
    setModel: function (datos) {
        this.vessels = datos.vessels;
        this.options = datos.options;
        return true;
    },
    setVessel: function (datos) {
        this.vessel = datos;
    }
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
                    {position: google.maps.ControlPosition.RIGHT_TOP},
            zoomControlOptions:
                    {position: google.maps.ControlPosition.RIGHT_CENTER},
            panControlOptions:
                    {position: google.maps.ControlPosition.RIGHT_CENTER},
            scaleControlOptions:
                    {position: google.maps.ControlPosition.BOTTOM_CENTER}
        };
        //var opciones = model.options.opciones;
        views.renderMap(opciones);
    },
    setMarkers: function (datos) {
        var boolean = model.setModel(datos);
        if (boolean) {
            views.renderMarkers(model.vessels);
            views.renderRmLi(model.vessels);
        }
    },
    setRmList: function () {
        views.renderRmLi(model.vessels);
    },
    setVesselInfo: function (datos) {
        ;
        var posicion = {};
        for (var i = 0, len = views.markers.length; i < len; i++) {
            if (views.markers[i].id === datos.id) {
                posicion.lat = datos.lat;
                posicion.long = datos.long;
            }
        }
        views.renderVesselPanel(datos);
        views.zoomOnVessel(posicion);
    },
    getVesselsPosition: function () {
        request.getVessels(controller.setMarkers);
    },
    getVesselInfo: function (id) {
        ;
        var vessels = model.vessels.vessel;
        for (var i = 0, len = vessels.length; i < len; i++) {
            if (vessels[i].id == id) {
                controller.setVesselInfo(vessels[i]);
                
            }
        }
    }
};

var views = {
    mapa: null,
    mc: null,
    markers: [],
    templateForVesselPanel: $('#vessel-info').html(),
    templateForRmLi: $('#rms-dropdown-li').html(),
    renderMap: function (opciones) {
        this.mapa = new google.maps.Map(document.getElementById("map-canvas"), opciones);
    },
    renderMarkers: function (datosvessels) {
        var vessels = datosvessels.vessel;
        if (this.mc !== null) {
            this.mc.clearMarkers();
        }
        this.markers = [];
        this.mc = null;
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
            this.markers[i] = marcador;
            google.maps.event.addListener(marcador, 'mouseover', function () {
                infowindow.setContent(this.html);
                infowindow.open(views.mapa, this);
            });
            google.maps.event.addListener(marcador, 'mouseout', function () {
                infowindow.close();
            });
            google.maps.event.addListener(marcador, 'click', function () {
                controller.getVesselInfo(this.id);
            });
        }
        var clusterOptions = {gridSize: 60, maxZoom: 12};
        this.mc =
                new MarkerClusterer(this.mapa, this.markers, clusterOptions);
    },
    renderVesselPanel: function (vessel) {
        var plantilla = Handlebars.compile(this.templateForVesselPanel);
        var html = plantilla(vessel);
        $('#handlebar-html').html(html);
    },
    renderRmLi: function (vessel) {
        var plantilla = Handlebars.compile(this.templateForRmLi);
        var html = plantilla(vessel);
        $('#rm-list').html(html);
    },
    zoomOnVessel: function (posicion) {
        ;
        var pos = new google.maps.LatLng(posicion.lat, posicion.long);
        this.mapa.setCenter(pos);
        this.mapa.setZoom(11);
    }
};

function initialize() {
    controller.initmap();
    controller.getVesselsPosition();
    setInterval(controller.getVesselsPosition, 60000);
}