var $ = require('jquery');
var getVesselsPosition = require('../shared/getvesselsposition');
var Handlebars = require('handlebars');
window.jQuery = $;
var bootstrap = require('../shared/bootstrap.js');

var request = {
    getVessels: function (callback) {
        getVesselsPosition(callback);
    },

    userconfig: function (callback) {
        try {
            $.getJSON("http://nautilus.intertug.com:8080/api/visualconfiguration/0")
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
};

var model = {
    vessels: {},
    serverDate: {},
    visualConfig: {},
    setVessels: function (vessels) {
        this.vessels = vessels;
    },
    setVisualConfig: function (datos) {
        this.visualConfig = {
            linksmenu: datos.linksmenu
        };
        return true;
    },
    setServerDate: function (serverDate) {
        this.serverDate = serverDate;
    }
};

var controller = {
    stringToDate: function (date) {
        var divDateOfTime = date.split(' ');
        var divDate = divDateOfTime[0].split('-');
        var divTime = divDateOfTime[1].split(':');
        var año = divDate[0];
        var mes = divDate[1] - 1; //Dates en javascript las fechas van de 0 a 11
        var dia = divDate[2];
        var hora = divTime[0];
        var minutos = divTime[1];
        var segundos = divTime[2];
        var fecha = new Date(año, mes, dia, hora, minutos, segundos);
        return fecha;
    },
    userconfig: function () {
        request.userconfig(this.setUserConfig);
    },
    setVesselsInfo: function (datos) {
        model.setVessels(datos.vessels);
        model.setServerDate(datos.vessels.actualdate);
        views.renderHandlebar(model.vessels);
    },

    setUserConfig: function (datos) {
        model.setVisualConfig(datos);
        views.renderLeftMenu(model.visualConfig.linksmenu);
        views.renderRightMenu(model.visualConfig.linksmenu);
    },
    getVessels: function () {
        request.getVessels(controller.setVesselsInfo);
    }
};

var views = {
    showDivRow: false,
    templateForHandlebar: $('#vessels-info').html(),
    registerHelpers: function () {
        Handlebars.registerHelper("isOutdatedDate", function (date) {
            var fechaGps = controller.stringToDate(date);
            var fechaActual = controller.stringToDate(model.serverDate);
            var diferenciaEnMinutos = Math.abs((fechaActual - fechaGps) / 60000);
            var limiteDeTiempoDesconectado = 30;
            if (diferenciaEnMinutos >= limiteDeTiempoDesconectado) {
                return "danger";
            } else {
                return "";
            }
        });
        Handlebars.registerHelper("isOverSpeedTop", function (vesselspeed) {
            var limiteDeVelocidad = 9;
            if (parseFloat(vesselspeed) > limiteDeVelocidad) {
                return "danger";
            }
            return "";
        });
        Handlebars.registerHelper("ShowDivRow", function (options) {
            if (views.showDivRow) {
                return options.fn(this);
            }
        });
        Handlebars.registerHelper("ChangeBool", function () {
            views.showDivRow = !views.showDivRow;
        });
        Handlebars.registerHelper("roundNumber", function (number) {
            return Math.round(number * 1000) / 1000;
        });
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
    renderHandlebar: function (vessels) {
        var vessels = vessels;
        views.showDivRow = false;
        var plantilla = Handlebars.compile(views.templateForHandlebar);
        var html = plantilla(vessels);
        $('#map-container').html(html);
    }
};

$(document).ready(function () {
    controller.userconfig();
    views.registerHelpers();
    controller.getVessels();
    setInterval(controller.getVessels, 60000);
});