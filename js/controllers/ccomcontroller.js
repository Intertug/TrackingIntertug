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
    vesselconfig: function (callback) {
        try {
            $.get("../jsons/vesselconfig.json",
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
    vesseldata: function (callback) {
        try {
            $.get("../jsons/vesseldata.json",
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
    vesseldataid: function (callback, id) {
        try {
            $.get("../jsons/vesseldataid.json",
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
    }
};

var model = {
    vessels: {},
    vesselsData: {},
    platforms: {},
    docks: {},
    anchorageAreas: {},
    mooringAreas: {},
    ccomInfo: {},
    visualConfig: {},
    vessel: {},
    vesselData: {},
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
    setVessels: function (datos) {
        this.vessels = datos.vessels;
    },
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
    }
};

var controller = {
    initmap: function () {
        //var centro = new google.maps.LatLng(9.024365, -72.913396);
        var centro = new google.maps.LatLng(model.visualConfig.mapCenter.lat, model.visualConfig.mapCenter.long);
        var opciones = {
            zoom: model.visualConfig.mapZoom,
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
        views.renderMap(opciones);
    },
    fleetconfig: function () {
        request.fleetconfig(this.setFleet);
    },
    userconfig: function () {
        request.userconfig(this.setUserConfig);
    },
    vesseldata: function () {
        request.vesseldata(controller.setVessels);
    },
    setFleet: function (datos) {
        var boolean = model.setFleet(datos);
        views.renderFleetInfo(model.ccomInfo);
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
        views.renderInfoTip(model.visualConfig.infotip);
    },
    setVessels: function (datos) {
        model.setVessels(datos);
        views.renderVessels(model.vessels);
        views.renderRmsList(model.vessels);
    },
    requestVesselInfo: function (id) {
        request.vesseldataid(this.showVesselInfo, id);
        //request.vesselconfigid(controller.showVesselInfo, id);
    },
    showVesselInfo: function (datos) {
        model.setVesselData(datos);
        var posicion = {
            lat: datos.vessels.position.lat,
            long: datos.vessels.position.long
        };
        views.renderVesselPanel(model.vessel, model.vesselData);
        views.zoomOnVessel(posicion);
    }

};

var views = {
    mapa: null,
    mc: null,
    markers: [],
    platformMarkers: [],
    docksMarkers: [],
    anchorageAreaMarkers: [],
    mooringAreaMarkers: [],
    templateRmList: $('#rms-dropdown-li').html(),
    templateVesselPanel: $('#vessel-info').html(),
    renderMap: function (opciones) {
        this.mapa = new google.maps.Map(document.getElementById("map-canvas"), opciones);
    },
    renderVessels: function (datosvessels) {
        var vessels = datosvessels;
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
            var content = "<h6>" + vessels[i].vesselName + " </h6>"
                    + "<b> Velocidad </b>: " + vessels[i].speed.value + " Nudos<br>"
                    + "<b> Fecha </b>: " + vessels[i].gpsdate.value
                    + "<br><br>";
            var position = new google.maps.LatLng(vessels[i].position.lat, vessels[i].position.long);
            var marcador = new google.maps.Marker({
                position: position,
                icon: '../imgs/ship.png',
                draggable: false,
                title: vessels[i].vesselName,
                zIndex: 3,
                html: content,
                id: vessels[i].vesselID
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
                controller.requestVesselInfo(this.id);
            });
        }
        var clusterOptions = {gridSize: 60, maxZoom: 12};
        this.mc =
                new MarkerClusterer(views.mapa, views.markers, clusterOptions);
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
    renderInfoTip: function (infotip) {
        var datos = {
            infotip: infotip
        };
        var source = $("#infotip").html();
        var plantilla = Handlebars.compile(source);
        var html = plantilla(datos);
        $('#infotip-html').html(html);
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
    renderVesselPanel: function (vessel, vesselData) {
        var template = this.templateVesselPanel;
        var plantilla = Handlebars.compile(template);
        var data = {
            vessel: vessel,
            vesselData: vesselData.vessels
        };
        var html = plantilla(data);
        $('#rmpanel').html(html);
    },
    renderRmsList: function (vessel) {
        var data = {
            vessel: vessel
        };
        var template = this.templateRmList;
        var plantilla = Handlebars.compile(template);
        var html = plantilla(data);
        $('#rm-list').html(html);
    },
    zoomOnVessel: function (posicion) {
        var pos = new google.maps.LatLng(posicion.lat, posicion.long);
        this.mapa.setCenter(pos);
        this.mapa.setZoom(11);
    }
};

function initialize() {
    controller.userconfig();
    controller.fleetconfig();
    controller.vesseldata();
    //var intervalVesselsMap = setInterval(controller.vesseldata, 60000)
}