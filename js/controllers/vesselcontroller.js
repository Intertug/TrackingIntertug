var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('../shared/bootstrap.js');
var MarkerClusterer = require('../shared/markerclusterer.js');
var Handlebars = require('handlebars');
var getVesselsGpsData = require('../shared/getvesselsgpsdata.js');
var getVessel = require('../shared/getvessel.js');


var request = {
    getVessels: function(callback) {
        getVesselsGpsData(callback);
    },
    getVesselInfo: function(callback, id) {
        getVessel(callback, id);
    },
    //    fleetconfig: function (callback) {
    //        try {
    //            $.get("../jsons/fleetconfig.json", {
    //                    SessionID: "",
    //                    GetData: ""
    //                })
    //                .done(function (data) {
    //                    var datos = data;
    //                    //        var datos = data.childNodes[0].childNodes[0].nodeValue;
    //                    //datos = JSON.parse(datos);
    //                    callback(datos);
    //                });
    //        } catch (err) {
    //            console.log(err);
    //            throw err;
    //        }
    //    },
    userconfig: function(callback) {
        try {
            $.getJSON("http://nautilus.intertug.com:8080/api/visualconfiguration/0")
                    .done(function(data) {
                        var datos = data;
                        //var datos = data.childNodes[0].childNodes[0].nodeValue;
                        //datos = JSON.parse(datos);
                        callback(datos);
                    });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    mapconfig: function(callback) {
        try {
            $.getJSON("http://nautilus.intertug.com:8080/api/mapconfiguration/0")
                    .done(function(data) {
                        var datos = data;
                        callback(datos);
                    });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    vesselconfigid: function(callback, id) {
        try {
            $.get("http://nautilus.intertug.com:8080/api/vesselconfiguration/" + id)
                    .done(function(data) {
                        var datos = data;
                        //  var datos = data.childNodes[0].childNodes[0].nodeValue;
                        //  datos = JSON.parse(datos);
                        callback(datos);
                    });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    vesselgpsdata: function(callback, id) {
        try {
            $.get("http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselGpsData?SessionID=&GetData=vesselid=" + id)
                    .done(function(data) {
                        var datos = data;
                        var datos = data.childNodes[0].childNodes[0].nodeValue;
                        datos = JSON.parse(datos);
                        console.log(datos);
                        callback(datos);
                    });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    gpspoint: function(callback, date, id) {
        try {
            $.get("../jsons/gpspoint.json", {
                SessionID: "",
                GetData: ""
            })
                    .done(function(data) {
                        //console.log(id);
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
    vesselid: -1,
    vessel: {},
    //vessels: {},
    //vesselsData: {},
    coordenates: [],
    platforms: {},
    docks: {},
    anchorageAreas: {},
    mooringAreas: {},
    ccomInfo: {},
    visualConfig: {},
    mapconfig: {},
    vesselData: {},
    point: {},
    setFleet: function(datos) {
        this.ccomInfo = {
            ccomName: datos.ccomName,
            ccomID: datos.ccomID,
            ccomDescription: datos.ccomDescription,
            regionData: datos.regionData
        };
        return true;
    },
    /** setVessels: function (datos) {
     this.vessels = datos.vessels;
     },**/
    setVisualConfig: function(datos) {
        this.visualConfig = {
            linksmenu: datos.linksmenu
        };
        return true;
    },
    setVessel: function(datos) {
        this.vessel = {
            vesselId: datos.vesselId,
            vesselName: datos.vesselName,
            image: datos.image,
            callsign: datos.callsign,
            IMO: datos.IMO,
            flag: datos.flag,
            fleetId: datos.fleetId,
            FleetName: datos.FleetName,
            dataSheet: datos.dataSheet,
            yearBuild: datos.yearBuild,
            lastReport: datos.lastReport,
            labels: {
                lblIMO: datos.labels.lblIMO,
                lblCallsign: datos.labels.lblCallsign
            }
        };
    },
    setMapConfig: function(datos) {
        this.mapconfig = {
            mapType: datos.mapType,
            zoom: datos.zoom,
            center: datos.center,
            cluster: datos.cluster
        }
    },
    setVesselData: function(datos) {
        this.vesselData = datos;
    },
    setGPSData: function(datos) {
        this.coordinates = datos.coordinates;
    },
    setPointData: function(datos) {
        this.point = datos.point;
    }
};

var mapa = new google.maps.Map(
        document.getElementById("map-canvas"), {
    zoom: model.visualConfig.mapZoom,
    //center: new google.maps.LatLng(model.mapconfig.center[0], model.mapconfig.center[1]),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControl: true,
    streetViewControl: false,
    scaleControl: true,
    mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
    },
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    panControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    scaleControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER
    }
}
);

var views = {
    MarkerCluster: null,
    platformMarkers: [],
    docksMarkers: [],
    anchorageAreaMarkers: [],
    mooringAreaMarkers: [],
    templateRmList: $('#rms-dropdown-li').html(),
    templateVesselPanel: $('#vessel-info').html(),
    templatePointPanel: $('#point-panel').html(),
    renderMap: function(opciones) {
        mapa = new google.maps.Map(
                document.getElementById("map-canvas"),
                opciones
                );
    },
    renderPoints: function(datosvessels, vesselid) {

        var vessels = datosvessels;
        var infowindow = null;
        infowindow = new google.maps.InfoWindow({
            content: ""
        });
        var coordenates = [];
        for (var i = 0, len = vessels.length; i < len; i++) {
            coordenates[i] = new google.maps.LatLng(
                    vessels[i].position.lat,
                    vessels[i].position.lon

                    );

            var content = "<b> Velocidad </b>: " + vessels[i].speed + " Nudos<br>" + "<b> Fecha </b>: " + vessels[i].datetime;
            var color = '#31BB3C';
            if (vessels[i].alert == 'true') {
                color = 'red';
            }
            var icon = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 1.5,
                strokeColor: color,
                fillColor: color
            };
            if (vessels[i] === vessels[len - 1]) {
                icon = '../imgs/ship.png';
                mapa.setCenter(coordenates[i]);
                mapa.setZoom(13);
            }
            var marcador = new google.maps.Marker({
                position: coordenates[i],
                icon: icon,
                draggable: false,
                zIndex: 3,
                html: content,
                id: vesselid,
                date: vessels[i].datetime,
                map: mapa
            });
            google.maps.event.addListener(marcador, 'mouseover',
                    function() {
                        infowindow.setContent(this.html);
                        infowindow.open(mapa, this);
                    });
            google.maps.event.addListener(marcador, 'mouseout',
                    function() {
                        infowindow.close();
                    });
            google.maps.event.addListener(marcador, 'click',
                    function() {
                        controller.gpspoint(this.date, this.id);
                    });

        }

        var flecha = {
            path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
            scale: 1.25,
            strokeColor: '#31BB3C' //'#11FB34'
        };
        var linea = new google.maps.Polyline({
            path: coordenates,
            map: mapa,
            icons: [{
                    icon: flecha,
                    offset: '50%',
                    repeat: "20px"
                }],
            geodesic: true,
            strokeColor: '#31BB3C', //'#11FB34',
            strokeOpacity: 1,
            strokeWeight: 1
        });
    },
    renderLeftMenu: function(linksmenu) {
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
    renderRightMenu: function(linksmenu) {
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
    renderPlatforms: function(datosplatforms) {
        var platforms = datosplatforms.platform;
        var infowindow = null;
        infowindow = new google.maps.InfoWindow({
            content: ""
        });
        for (var i = 0; i < platforms.length; i++) {
            var content = "<h6>" + platforms[i].platformname.value + " </h6>";
            var position = new google.maps.LatLng(platforms[i].position.lat.value,
                    platforms[i].position.long.value);
            var platform = new google.maps.Marker({
                position: position,
                icon: '../imgs/' + platforms[i].icon,
                draggable: false,
                title: platforms[i].platformname.value,
                zIndex: 1,
                html: content,
                map: mapa
            });
            this.platformMarkers[i] = platform;
            google.maps.event.addListener(platform, 'mouseover', function() {
                infowindow.setContent(this.html);
                infowindow.open(mapa, this);
            });
            google.maps.event.addListener(platform, 'mouseout', function() {
                infowindow.close();
            });
        }
    },
    renderDocks: function(datosdocks) {
        var docks = datosdocks.dock;
        var infowindow = null;
        infowindow = new google.maps.InfoWindow({
            content: ""
        });
        for (var i = 0; i < docks.length; i++) {
            var content = "<h6>" + docks[i].dockname + " </h6>";
            var position = new google.maps.LatLng(docks[i].position.lat.value,
                    docks[i].position.long.value);
            var marcador = new google.maps.Marker({
                position: position,
                icon: '../imgs/' + docks[i].icon,
                draggable: false,
                title: docks[i].dockname,
                zIndex: 1,
                html: content,
                map: mapa
            });
            views.docksMarkers[i] = marcador;
            google.maps.event.addListener(marcador, 'mouseover', function() {
                infowindow.setContent(this.html);
                infowindow.open(mapa, this);
            });
            google.maps.event.addListener(marcador, 'mouseout', function() {
                infowindow.close();
            });
        }
    },
    renderAnchorageAreas: function(datosAnchorageAreas) {
        var anchorageareas = datosAnchorageAreas.anchoragearea;
        var infowindow = null;
        infowindow = new google.maps.InfoWindow({
            content: ""
        });
        for (var i = 0; i < anchorageareas.length; i++) {
            var coordenada = new google.maps.LatLng(anchorageareas[i].position.lat.value, anchorageareas[i].position.long.value);
            var circleOptions = {
                strokeColor: anchorageareas[i].fillcolor.value,
                strokeOpacity: anchorageareas[i].opacity.value,
                strokeWeight: 1,
                fillColor: anchorageareas[i].fillcolor.value,
                fillOpacity: anchorageareas[i].opacity.value,
                map: mapa,
                center: coordenada,
                html: anchorageareas[i].anchorageareaname,
                radius: parseInt(anchorageareas[i].radius.value)

            };
            var circle = new google.maps.Circle(circleOptions);
            views.anchorageAreaMarkers[i] = circle;
            google.maps.event.addListener(circle, 'click', function(event) {
                var point = this.center;
                infowindow.setContent(this.html);
                if (event) {
                    point = event.latLng;
                }
                infowindow.setPosition(point);
                infowindow.open(mapa, this);
            });
        }
    },
    renderLeftMenu: function(linksmenu) {
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
            renderRightMenu: function(linksmenu) {
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
            renderMooringAreas: function(datosMooringAreas) {
                var moorings = datosMooringAreas.mooringarea;
                var infowindow = null;
                infowindow = new google.maps.InfoWindow({
                    content: ""
                });
                for (var i = 0, len = moorings.length; i < len; i++) {
                    var arraycoordenadas = [];
                    var mooringArea = {};
                    for (var j = 0, len2 = moorings[i].vertices.length; j < len2; j++) {
                        arraycoordenadas.push(new google.maps.LatLng(moorings[i].vertices[j].position.lat.value,
                                moorings[i].vertices[j].position.long.value));
                    }
                    mooringArea = new google.maps.Polygon({
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
                    mooringArea.setMap(mapa);
                    views.mooringAreaMarkers[i] = mooringArea;
                    google.maps.event.addListener(views.mooringAreaMarkers[i], 'click', function(event) {
                        var point = this.getPath().getAt(0);
                        infowindow.setContent(this.html);
                        if (event) {
                            point = event.latLng;
                        }
                        infowindow.setPosition(point);
                        infowindow.open(mapa);
                    });
                }
            },
    renderRmInfo: function(datos) {
        var datos = datos;
        var source = $("#rm-info").html();
        var plantilla = Handlebars.compile(source);
        var html = plantilla(datos);
        $('#rm-html').html(html);
    },
    
    //    renderAlertsInfo: function (datos) {
    //        var datos = {
    //            alerts: datos.vessel.alerts,
    //            labels: datos.vessel.alerts[0]
    //        };
    //        console.log(datos.labels);
    //        var source = $("#html-alerts").html();
    //        var plantilla = Handlebars.compile(source);
    //        var html = plantilla(datos);
    //        $('#alerts-html').html(html);
    //    },
    
    zoomOnVessel: function(posicion) {
        var pos = new google.maps.LatLng(posicion.lat, posicion.long);
        mapa.setCenter(pos);
        mapa.setZoom(11);
    },
    renderPointPanel: function(point) {
        console.log(point);
        var data = {
            point: point
        };
        var template = this.templatePointPanel;
        var plantilla = Handlebars.compile(template);
        var html = plantilla(data);
        $('#point-html').html(html);
    }
};

var controller = {
    initmap: function() {
        var centro = new google.maps.LatLng(model.mapconfig.center[0], model.mapconfig.center[1]);
        //var centro = new google.maps.LatLng(9.024365, -72.913396);
        //        var centro = new google.maps.LatLng(
        //            model.visualConfig.mapCenter.lat,
        //            model.visualConfig.mapCenter.long
        //        );
        var opciones = {
            zoom: model.visualConfig.mapZoom,
            center: centro,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControl: true,
            streetViewControl: false,
            scaleControl: true,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            panControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scaleControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER
            }
        };
        views.renderMap(opciones);
    },
    //    fleetconfig: function () {
    //        request.fleetconfig(this.setFleet);
    //    },
    userconfig: function() {
        request.userconfig(this.setUserConfig);
    },
    mapconfig: function() {
        request.mapconfig(this.setMapConfig);
    },
    vesselconfigid: function() {
        request.vesselconfigid(this.setVessel, model.vesselid);
    },
    vesselgpsdata: function() {
        request.vesselgpsdata(this.setGPSData, model.vesselid);
    },
    gpspoint: function(date, id) {
        request.gpspoint(this.setPointData, date = null, id = null);
    },
    /*vesseldata: function () {
     request.vesseldata(controller.setVessels);
     },*/
    setPointData: function(datos) {
        model.setPointData(datos);
        views.renderPointPanel(model.point);
    },
    setMapConfig: function(datos) {
        model.setMapConfig(datos);
        controller.initmap();
    },
    setGPSData: function(datos) {
        model.setGPSData(datos);
        views.renderPoints(datos.coordinates, model.vessel.id);
        views.renderPointPanel(datos.coordinates[datos.coordinates.length - 1]);
    },
    setFleet: function(datos) {
        var boolean = model.setFleet(datos);
        views.renderPlatforms(model.platforms);
        views.renderDocks(model.docks);
        views.renderAnchorageAreas(model.anchorageAreas);
        views.renderMooringAreas(model.mooringAreas);
    },
    setUserConfig: function(datos) {
        model.setVisualConfig(datos);
        views.renderLeftMenu(model.visualConfig.linksmenu);
        views.renderRightMenu(model.visualConfig.linksmenu);
    },
    setVessel: function(datos) {
        model.setVessel(datos);
        views.renderRmInfo(model.vessel);
        //        views.renderAlertsInfo(model.vessel);
    }
};



$(document).ready(function() {
    controller.mapconfig();
    controller.userconfig();
    model.vesselid = window.location.search.split('?')[1].split('=')[1];
    //    controller.fleetconfig();
    controller.vesselconfigid();
    controller.vesselgpsdata(model.vesselid);
    //controller.vesseldata();
    //var intervalVesselsMap = setInterval(controller.vesseldata, 60000)
});