var $ = require('jQuery');
window.jQuery = $;
var bootstrap = require('../shared/bootstrap.js');
var MarkerClusterer = require('../shared/markerclusterer.js');
var Handlebars = require('handlebars');
var getVesselsPosition = require('../shared/getvesselsposition.js');
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
            $.getJSON("http://nautilus.intertug.com:8080/api/mapconfiguration/2")
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
            $.get("../jsons/fleetper.json")
                .done(function (data) {
                    var datos = data;
                    callback(datos);

                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    //    vesseldata: function (callback) {
    //        try {
    //            $.get("http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition?SessionID=&GetData=FLEETID=2", {
    //                    SessionID: "",
    //                    GetData: ""
    //                })
    //                .done(function (data) {
    //                    var datos = data;
    //                    var datos = data.childNodes[0].childNodes[0].nodeValue;
    //                    datos = JSON.parse(datos);
    //                    callback(datos);
    //                });
    //        } catch (err) {
    //            console.log(err);
    //            throw err;
    //        }
    //    }

    vesseldata: function (callback) {
        try {
            $.get("../jsons/vesseldata.json", {
                    SessionID: "",
                    GetData: ""
                })
                .done(function (data) {
                    var datos = data;
                    //                    var datos = data.childNodes[0].childNodes[0].nodeValue;
                    //                    datos = JSON.parse(datos);
                    callback(datos);
                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    vesseldataid: function (callback, id) {
        try {
            $.get("../jsons/vesseldataid.json", {
                    SessionID: "",
                    GetData: ""
                })
                .done(function (data) {
                    var datos = data;
                    //var datos = data.childNodes[0].childNodes[0].nodeValue;
                    //datos = JSON.parse(datos);

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
    platforms: {},
    docks: {},
    anchorageAreas: {},
    mooringAreas: {},
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
        //        this.anchorageAreas = datos.anchorages;
        //        this.docks = datos.docks;
        //        this.platforms = datos.platforms;
        //        this.moorings = datos.moorings;
        this.mapconfig = {
            mapType: datos.mapType,
            zoom: datos.zoom,
            center: datos.center,
            cluster: datos.cluster,
            platforms: datos.platforms,
            docks: datos.docks,
            anchorages: datos.anchorages,
            moorings: datos.moorings
        };
        console.log(datos.center);
        return true;

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
        //        console.log(model.platforms);
        //        views.renderPlatforms(model.platforms);
        //        views.renderAnchorageAreas(model.anchorageAreas);
        //        views.renderDocks(model.docks);
        //        views.renderMoorings(model.moorings);
        //        console.log(model.platforms);
        views.renderPlatforms(model.mapconfig.platforms);
        views.renderDocks(model.mapconfig.docks);
        //        views.renderAnchorageAreas(model.mapconfig.anchorageAreas);
        views.renderMooringAreas(model.mapconfig.moorings);


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
    platformMarkers: [],
    docksMarkers: [],
    anchorageAreaMarkers: [],
    mooringAreaMarkers: [],
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
    renderPlatforms: function (datosplatforms) {
        var platform = datosplatforms;
        console.log(platform);
        var infowindow = null;
        infowindow = new google.maps.InfoWindow({
            content: ""
        });
        for (var i = 0; i < platform.length; i++) {
            var content = "<h6>" + platform[i].name + " </h6>";
            var position = new google.maps.LatLng(platform[i].center[0],
                platform[i].center[1]);
            var platformM = new google.maps.Marker({
                center: position,
                icon: '../imgs/' + platform[i].icon,
                draggable: false,
                title: platform[i].name,
                zIndex: 1,
                html: content,
                map: views.mapa
            });
            this.platformMarkers[i] = platformM;
            google.maps.event.addListener(platformM, 'mouseover', function () {
                infowindow.setContent(this.html);
                infowindow.open(views.mapa, this);
            });
            google.maps.event.addListener(platformM, 'mouseout', function () {
                infowindow.close();
            });
        }
    },
    renderDocks: function (datosdocks) {
        var docks = datosdocks;
        var infowindow = null;
        infowindow = new google.maps.InfoWindow({
            content: ""
        });
        for (var i = 0; i < docks.length; i++) {
            var content = "<h6>" + docks[i].name + " </h6>";
            var position = new google.maps.LatLng(docks[i].center[0],
                docks[i].center[1]);
            var marcador = new google.maps.Marker({
                center: position,
                icon: '../imgs/' + docks[i].icon,
                draggable: false,
                title: docks[i].name,
                zIndex: 1,
                html: content,
                map: views.mapa
            });
            views.docksMarkers[i] = marcador;
            google.maps.event.addListener(marcador, 'mouseover', function () {
                infowindow.setContent(this.html);
                infowindow.open(views.mapa, this);
            });
            google.maps.event.addListener(marcador, 'mouseout', function () {
                infowindow.close();
            });
        }
    },
    //    renderAnchorageAreas: function (datosAnchorageAreas) {
    //        var anchorageareas = datosAnchorageAreas;
    //        var infowindow = null;
    //        infowindow = new google.maps.InfoWindow({
    //            content: ""
    //        });
    //        for (var i = 0; i < anchorageareas.length; i++) {
    //            var coordenada = new google.maps.LatLng(anchorageareas[i].center[0], anchorageareas[i].center[1]);
    //            var circleOptions = {
    ////                strokeColor: anchorageareas[i].fillcolor.value,
    ////                strokeOpacity: anchorageareas[i].opacity.value,
    //                strokeWeight: 1,
    ////                fillColor: anchorageareas[i].fillcolor.value,
    ////                fillOpacity: anchorageareas[i].opacity.value,
    //                map: views.mapa,
    //                center: coordenada,
    //                html: anchorageareas[i].name,
    ////                radius: parseInt(anchorageareas[i].radius.value)
    //
    //            };
    //            var circle = new google.maps.Circle(circleOptions);
    //            views.anchorageAreaMarkers[i] = circle;
    //            google.maps.event.addListener(circle, 'click', function (event) {
    //                var point = this.center;
    //                infowindow.setContent(this.html);
    //                if (event) {
    //                    point = event.latLng;
    //                }
    //                infowindow.setPosition(point);
    //                infowindow.open(views.mapa, this);
    //            });
    //        }
    //    },
    renderMooringAreas: function (datosMooringAreas) {
        var moorings = datosMooringAreas;
        var infowindow = null;
        infowindow = new google.maps.InfoWindow({
            content: ""
        });
        for (var i = 0, len = moorings.length; i < len; i++) {
            var arraycoordenadas = [];
            var mooringArea = {};
            for (var j = 0, len2 = moorings[i].vertices.length; j < len2; j++) {
                arraycoordenadas.push(new google.maps.LatLng(moorings[i].vertices[j],
                    moorings[i].vertices[j]));
            }
            mooringArea = new google.maps.Polygon({
                paths: arraycoordenadas,
                //                strokeColor: moorings[i].fillColor,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                zIndex: 5,
                //                fillColor: moorings[i].fillColor,
                //                fillOpacity: moorings[i].opacity,
                html: moorings[i].name,
                map: views.mapa
            });
            mooringArea.setMap(views.mapa);
            views.mooringAreaMarkers[i] = mooringArea;
            google.maps.event.addListener(views.mooringAreaMarkers[i], 'click', function (event) {
                var point = this.getPath().getAt(0);
                infowindow.setContent(this.html);
                if (event) {
                    point = event.latLng;
                }
                infowindow.setPosition(point);
                infowindow.open(views.mapa);
            });
        }
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
    model.fleetid = window.location.search.split('?')[1].split('=')[1];
    controller.jQueryEvents();
    controller.getVesselsPosition();
    setInterval(controller.getVesselsPosition, 60000);
});