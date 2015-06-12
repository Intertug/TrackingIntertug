var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('../shared/bootstrap.js');
var MarkerClusterer = require('../shared/markerclusterer.js');
var Handlebars = require('handlebars');

var request = {
    fleetconfig: function (callback) {
        try {
            $.get("../jsons/fleetconfig.json",
                    {SessionID: "", GetData: ""})
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
    },
    userconfig: function (callback) {
        try {
            $.get("../jsons/userconfig.json",
                    {SessionID: "", GetData: ""})
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
    },
    vesselconfigid: function (callback, id) {
        try {
            $.get("../jsons/vesselconfigid.json",
                    {SessionID: "", GetData: ""})
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
    },
    vesselgpsdata: function(callback, id){
        try {
            $.get("../jsons/vesselgpsdata.json",
                    {SessionID: "", GetData: ""})
                    .done(function (data) {
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
    },
    gpspoint: function(callback, date, id){
        try {
            $.get("../jsons/gpspoint.json",
                    {SessionID: "", GetData: ""})
                    .done(function (data) {
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
    vesselData: {},
    point: {},
    setFleet: function (datos) {
        this.platforms = datos.platforms;
        this.docks = datos.docks;
        this.anchorageAreas = datos.anchorageareas;
        this.mooringAreas = datos.mooringareas;
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
    setVisualConfig: function (datos) {
        this.visualConfig = {
            linksmenu: datos.linksmenu,
            linksbotones: datos.linksbotones,
            infotip: datos.infotip,
            mapCenter: datos.mapCenter,
            mapZoom: parseInt(datos.mapZoom),
        };
        return true;
    },
    setVessel: function (datos) {
        this.vessel = datos.vessel;
    },
    setVesselData: function (datos) {
        this.vesselData = datos;
    },
    setGPSData: function(datos){
        this.coordenates = datos.coordenates;
    },
    setPointData: function(datos){
        this.point = datos.point;
    }
};

var controller = {
    initmap: function () {
        //var centro = new google.maps.LatLng(9.024365, -72.913396);
        var centro = new google.maps.LatLng(
            model.visualConfig.mapCenter.lat,
            model.visualConfig.mapCenter.long
        );
        var opciones = {
            zoom: model.visualConfig.mapZoom,
            center: centro,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControl: true,
            streetViewControl: false,
            scaleControl: true,
            mapTypeControlOptions:{
                position: google.maps.ControlPosition.LEFT_TOP
            },
            zoomControlOptions:{
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            panControlOptions:{
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scaleControlOptions:{
                position: google.maps.ControlPosition.BOTTOM_CENTER
            }
        };
        views.renderMap(opciones);
    },
    fleetconfig: function () {
        request.fleetconfig(this.setFleet);
    },
    userconfig: function () {
        request.userconfig(this.setUserConfig);
    },
    vesselconfigid: function(){
        request.vesselconfigid(this.setVessel);
    },
    vesselgpsdata: function(){
        request.vesselgpsdata(this.setGPSData);
    },
    gpspoint: function(date, id){
        request.gpspoint(this.setPointData, date = null, id = null);
    },
    /*vesseldata: function () {
        request.vesseldata(controller.setVessels);
    },*/
    setPointData: function(datos){
        model.setPointData(datos);
        views.renderPointPanel(model.point);
    },
    setGPSData: function(datos){
        //model.setGPSData(datos);
        views.renderPoints(datos.coordenates, model.vessel.id);
        console.log(datos.coordenates);
        views.renderPointPanel(datos.coordenates[datos.coordenates.length-1]);
    },
    setFleet: function (datos) {
        var boolean = model.setFleet(datos);
        views.renderPlatforms(model.platforms);
        views.renderDocks(model.docks);
        views.renderAnchorageAreas(model.anchorageAreas);
        views.renderMooringAreas(model.mooringAreas);
    },
    setUserConfig: function (datos) {
        model.setVisualConfig(datos);
        controller.initmap();
        views.renderLeftMenu(model.visualConfig.linksmenu);
        views.renderRightMenu(model.visualConfig.linksmenu);
        //views.renderInfoTip(model.visualConfig.infotip);
    },
    setVessel: function(datos){
        model.setVessel(datos);
        views.renderRmInfo(datos);
        views.renderAlertsInfo(datos);
    }
};

var views = {
    mapa: null,
    MarkerCluster: null,
    platformMarkers: [],
    docksMarkers: [],
    anchorageAreaMarkers: [],
    mooringAreaMarkers: [],
    templateRmList: $('#rms-dropdown-li').html(),
    templateVesselPanel: $('#vessel-info').html(),
    templatePointPanel: $('#point-panel').html(),
    renderMap: function (opciones) {
        this.mapa = new google.maps.Map(
            document.getElementById("map-canvas"),
            opciones
        );
    },
    renderPoints: function (datosvessels, vesselid) {
        console.log("veces");
        var vessels = datosvessels;
        var infowindow = null;
        infowindow = new google.maps.InfoWindow({
            content: ""
        });
        var coordenates = [];
        for (var i = 0, len = vessels.length; i < len; i++) {
            coordenates[i] = new google.maps.LatLng(
                vessels[i].position.value.lat,
                vessels[i].position.value.lon
            );
            var content = "<b> Velocidad </b>: "
                + vessels[i].speed.value + " Nudos<br>"
                + "<b> Fecha </b>: " + vessels[i].datetime.value;
            var color = '#660099';
            if(vessels[i].alert == 'true'){
                color = 'red';
            }
            var icon = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 1.5,
                strokeColor: color,
                fillColor: color
            };
            if(vessels[i] === vessels[len-1]){
                icon = '../imgs/ship.png';
                this.mapa.setCenter(coordenates[i]);
                this.mapa.setZoom(13);
            }
            var marcador = new google.maps.Marker({
                position: coordenates[i],
                icon: icon,
                draggable: false,
                zIndex: 3,
                html: content,
                id: vesselid,
                date: vessels[i].datetime.value,
                map: this.mapa
            });
            google.maps.event.addListener(marcador, 'mouseover',
                function () {
                    infowindow.setContent(this.html);
                    infowindow.open(views.mapa, this);
                });
            google.maps.event.addListener(marcador, 'mouseout',
                function () {
                    infowindow.close();
                });
            google.maps.event.addListener(marcador, 'click',
                function () {
                    controller.gpspoint(this.date, this.id);
                });
            
        }

        var flecha = {
          path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
          scale: 1.25,
          strokeColor: '#660099'//'#11FB34'
        };
        var linea = new google.maps.Polyline({
          path: coordenates,
          map: this.mapa,
          icons: [{
            icon: flecha,
            offset: '50%',
            repeat: "20px"
          }],
          geodesic: true,
          strokeColor: '#660099',//'#11FB34',
          strokeOpacity: 1,
          strokeWeight: 1
        });
    },
    renderPlatforms: function (datosplatforms) {
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
                map: views.mapa
            });
            this.platformMarkers[i] = platform;
            google.maps.event.addListener(platform, 'mouseover', function () {
                infowindow.setContent(this.html);
                infowindow.open(views.mapa, this);
            });
            google.maps.event.addListener(platform, 'mouseout', function () {
                infowindow.close();
            });
        }
    },
    renderDocks: function (datosdocks) {
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
    renderAnchorageAreas: function (datosAnchorageAreas) {
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
                map: views.mapa,
                center: coordenada,
                html: anchorageareas[i].anchorageareaname,
                radius: parseInt(anchorageareas[i].radius.value)

            };
            var circle = new google.maps.Circle(circleOptions);
            views.anchorageAreaMarkers[i] = circle;
            google.maps.event.addListener(circle, 'click', function (event) {
                var point = this.center;
                infowindow.setContent(this.html);
                if (event) {
                    point = event.latLng;
                }
                infowindow.setPosition(point);
                infowindow.open(views.mapa, this);
            });
        }
    },
    renderMooringAreas: function (datosMooringAreas) {
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
    renderRmInfo: function (datos) {
        var datos = {
            rmInfo: datos.vessel
        };
        var source = $("#rm-info").html();
        var plantilla = Handlebars.compile(source);
        var html = plantilla(datos);
        $('#rm-html').html(html);
    },
    renderAlertsInfo: function(datos){
        console.log(datos)
        var datos = {
            alerts: datos.vessel.alerts,
            labels: datos.vessel.alerts[0]
        };
        console.log(datos.labels);
        var source = $("#html-alerts").html();
        var plantilla = Handlebars.compile(source);
        var html = plantilla(datos);
        $('#alerts-html').html(html);
    },
    zoomOnVessel: function (posicion) {
        var pos = new google.maps.LatLng(posicion.lat, posicion.long);
        this.mapa.setCenter(pos);
        this.mapa.setZoom(11);
    },
    renderPointPanel: function(point){
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

$(document).ready(function(){
    controller.userconfig();
    controller.fleetconfig();
    controller.vesselconfigid();
    controller.vesselgpsdata();
    //controller.vesseldata();
    //var intervalVesselsMap = setInterval(controller.vesseldata, 60000)
});