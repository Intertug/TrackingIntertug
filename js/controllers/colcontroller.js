var $ = require('jQuery');
window.jQuery = $;
var bootstrap = require('../shared/bootstrap.js');
var MarkerClusterer = require('../shared/markerclusterer.js');
var Handlebars = require('handlebars');
var getVesselsPosition = require('../shared/getvesselspositionCol.js');
var getVessel = require('../shared/getvessel.js');

var request = {
    getVessels: function (callback) {
        getVesselsPosition(callback);
    },
    getVesselInfo: function (callback, id) {
        getVessel(callback, id);
    },

    userconfig: function (callback) {
        try {
            $.getJSON("http://nautilus.intertug.com:8080/api/visualconfiguration/0")
                .done(function (data) {
                    var datos = data;
                    callback(datos);
                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    mapconfig: function (callback) {
        try {
            $.getJSON("http://nautilus.intertug.com:8080/api/mapconfiguration/1")
                .done(function (data) {
                    var datos = data;
                    callback(datos);
                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    fleetconfig: function (callback) {
        try {
            $.get("../jsons/fleetcol.json")
                .done(function (data) {
                    var datos = data;
                    callback(datos);

                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
};


var model = {
    vessels: {},
    vessel: {},
    visualConfig: {},
    mapconfig: {},
    setFleet: function (datos) {
        this.ccomInfo = {
            ccomName: datos.ccomName,
            ccomID: datos.ccomID,
            ccomDescription: datos.ccomDescription
                //            regionData: datos.regionData
        };
        return true;
    },
    setModel: function (datos) {
        this.vessels = datos.vessels;
        return true;
    },
    setVessel: function (datos) {
        this.vessel = datos;
    },
    setVisualConfig: function (datos) {
        this.visualConfig = {
            linksmenu: datos.linksmenu
        };
        return true;
    },
    setMapConfig: function (datos) {
        this.mapconfig = {
            mapType: datos.mapType,
            zoom: datos.zoom,
            center: datos.center,
            cluster: datos.cluster
        }
    }
};

var controller = {
    initmap: function () {
        var centro = new google.maps.LatLng(model.mapconfig.center[0], model.mapconfig.center[1]);

        var opciones = {
            zoom: model.mapconfig.zoom,
            center: centro,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControl: true,
            streetViewControl: false,
            scaleControl: true,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            panControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            scaleControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER
            }
        };
        views.renderMap(opciones);
    },
    userconfig: function () {
        request.userconfig(this.setUserConfig);
    },
    mapconfig: function () {
        request.mapconfig(this.setMapConfig);
    },
    fleetconfig: function () {
        request.fleetconfig(this.setFleet);
    },
    setMarkers: function (datos) {
        var boolean = model.setModel(datos);
        if (boolean) {
            views.renderMarkers(model.vessels);
            views.renderRmLi(model.vessels);
        } else {
            controller.setMarkers(datos);
        }
    },
    setUserConfig: function (datos) {
        model.setVisualConfig(datos);
        views.renderLeftMenu(model.visualConfig.linksmenu);
        views.renderRightMenu(model.visualConfig.linksmenu);
    },
    setMapConfig: function (datos) {
        model.setMapConfig(datos);
        controller.initmap();
    },
    setFleet: function (datos) {
        var boolean = model.setFleet(datos);
        views.renderFleetInfo(model.ccomInfo);
        //        views.renderRegionData(model.ccomInfo.regionData);
    },
    setVesselInfo: function (datos) {
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
    jQueryEvents: function () {
        $('#rm-list').on('click', 'li', function (event) {
            event.preventDefault();
            console.log($(this).text());
            var vessels = model.vessels.vessel;
            for (var i = 0, len = vessels.length; i < len; i++) {
                if (vessels[i].id == this.id) {
                    controller.setVesselInfo(vessels[i]);
                }
            }
        });
    },
    getVesselInfo: function (id) {
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
    MarkerCluster: null,
    markers: [],
    templateForVesselPanel: $('#vessel-info').html(),
    templateForRmLi: $('#rms-dropdown-li').html(),
    renderMap: function (opciones) {
        this.mapa = new google.maps.Map(document.getElementById("map-canvas"), opciones);
    },
    renderLeftMenu: function (linksmenu) {
        var leftmenus = [];

        for (var i = 0, len = linksmenu.length; i < len; i++) {
            if (linksmenu[i].position === 'left') {
                leftmenus.push(linksmenu[i]);
            }
        }
        var datos = {
            linksmenu: leftmenus
        };

        var source = $("#navbar-menu-left").html();
        var template = Handlebars.compile(source);
        var html = template(datos);
        $('#navbar__left').html(html);
    },
    renderRightMenu: function (linksmenu) {
        var rightmenus = [];
        for (var i = 0, len = linksmenu.length; i < len; i++) {
            if (linksmenu[i].position === 'right') {
                rightmenus.push(linksmenu[i]);
            }
        }
        var datos = {
            linksmenu: rightmenus
        };
        var source = $("#navbar-menu-right").html();
        var plantilla = Handlebars.compile(source);
        var html = plantilla(datos);
        $('#navbar__right').html(html);
    },
    renderFleetInfo: function (ccomInfo) {
        var datos = {
            ccomInfo: ccomInfo
        };
        var source = $("#fleet-info").html();
        var plantilla = Handlebars.compile(source);
        var html = plantilla(datos);
        $('#fleet-html').html(html);
    },
    renderMarkers: function (datosvessels) {
        var vessels = datosvessels.vessel;
        if (this.MarkerCluster !== null) {
            this.MarkerCluster.clearMarkers();
        }
        this.markers = [];
        this.MarkerCluster = null;
        var infowindow = null;
        infowindow = new google.maps.InfoWindow({
            content: ""
        });
        for (var i = 0, len = vessels.length; i < len; i++) {
            var content = "<h6>" + vessels[i].vesselname + " </h6>" + "<b> Velocidad </b>: " + vessels[i].speed + " Nudos<br>" + "<b> Fecha </b>: " + vessels[i].gpsdate + "<br><br>";
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
        var clusterOptions = {
            gridSize: model.mapconfig.cluster,
            maxZoom: 12
        };
        this.MarkerCluster =
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
    //    renderRegionData: function (regionData) {
    //        var data = {
    //            entities: regionData.entities
    //        };
    //        var template = $('#region-data').html();
    //        var plantilla = Handlebars.compile(template);
    //        var html = plantilla(data);
    //        $('#region-html').html(html);
    //    },
    zoomOnVessel: function (posicion) {
        var pos = new google.maps.LatLng(posicion.lat, posicion.long);
        this.mapa.setCenter(pos);
        this.mapa.setZoom(11);
    }
};


$(document).ready(function () {
    controller.mapconfig();
    controller.userconfig();
    controller.fleetconfig();
    controller.jQueryEvents();
    controller.getVesselsPosition();
    setInterval(controller.getVesselsPosition, 60000);
});