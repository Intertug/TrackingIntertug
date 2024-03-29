var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('../shared/bootstrap.js');
var battatech_excelexport = require('../shared/excelexport.js');
var MarkerClusterer = require('../shared/markerclusterer.js');
var Handlebars = require('handlebars');


var request = {
	userconfig: function(callback){
		try {
            $.get("../jsons/userconfig.json", {SessionID: "", GetData: ""})
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
    getReport: function(rm,dateone,datetwo, callback){
        try {
            $.get("../jsons/reportData.json",{SessionID: "", GetData: ""})
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
    visualConfig: {},
    reportData: {},
    setReportData: function(datos){
        try{
            model.reportData = {
                report: datos.reportData,
                labels: datos
            };
            return true;
        }catch(e){
            return false;
        }
    },
	setVisualConfig: function (datos) {
        this.visualConfig = {
            linksmenu: datos.linksmenu,
            linksbotones: datos.linksbotones,
            infotip: datos.infotip,
            mapCenter: datos.mapCenter,
            mapZoom: parseInt(datos.mapZoom),
        } ;
        return true;
    },
};


var controller = {
	userconfig: function () {
        request.userconfig(this.setUserConfig);
    },
    setUserConfig: function (datos) {
        model.setVisualConfig(datos);
        views.renderLeftMenu(model.visualConfig.linksmenu);
        views.renderRightMenu(model.visualConfig.linksmenu);
        views.renderInfoTip(model.visualConfig.infotip);
    },
    reportData: function(){
        /*var today = new Date();
        var month = today.getMonth()+1;
        var year = today.getFullYear();*/
        request.getReport(23, null, null, controller.drawCharts);
    },
    validReportRequest: function(){
        var dateone, datetwo, rm;
        var valid = true;
        var today = new Date();
        rm = document.getElementById("rm").selectedIndex;
        dateone = document.getElementById("dateone").value;
        datetwo = document.getElementById("datetwo").value;
        console.log(rm);
        console.log(dateone);
        console.log(datetwo);
        if(rm == null || rm == 0){
            alert("Debes escoger un remolcador");
            return false;
        }
        dateoneDate = new Date(dateone);
        if(dateone == "" || dateoneDate > today){
            alert("La fecha de inicio no puede estar vacía o ser mayor al día de hoy.");
            return false;
        }
        datetwoDate = new Date(datetwo);
        if(datetwo == "" || datetwoDate > today){
            alert("La fecha de fin no puede estar vacía o ser mayor al día de hoy.");
            return false;
        }
        if(dateoneDate > datetwoDate){
            alert("La fecha de inicio no puede ser mayor a la fecha final");
            return false;
        }
        return true;
    },
    requestReport: function(){
        rm = document.getElementById("rm").selectedIndex;
        dateone = document.getElementById("dateone").value;
        datetwo = document.getElementById("datetwo").value;
        request.getReport(rm,dateone, datetwo, controller.generateReport);
    },
    drawCharts: function(datos){
        var bool = model.setReportData(datos);
        if(bool === true){
            views.drawCharts(datos);
            views.renderTable(datos);
        }else{
            controller.drawCharts(datos);
        }
    },
    exportTable: function(){
        $(document).ready(function () {
            $("#exportTable").click(function () {
                $("#pane__table").battatech_excelexport({
                    containerid: "pane__table",
                    datatype: 'table'
                });
            });
        });
    }
};

var views = {
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
    drawCharts: function(report){
        var datos = report.reportData;
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Día');
        data.addColumn('number', 'Prop. Babor');
        data.addColumn('number', 'Prop. Estribor');
        data.addColumn('number', 'Generador Estribor');
        data.addColumn('number', 'Generador Babor');
        data.addColumn('number', 'Bowthruster');
        var rows = [];
        for(var i=0, len=datos.length; i<len; i++){
            var array = [];
            var day = datos[i].day.split("-");
            array.push(parseInt(day[2]));
            if(datos[i].HMPB !== 0){
                PBperf = datos[i].CMPB / datos[i].HMPB;
                array.push(PBperf);
            }else{
                array.push(0);
            }

            if(datos[i].HMPE !== 0){
                PEperf = datos[i].CMPE / datos[i].HMPE;
                array.push(PEperf);
            }else{
                array.push(0);
            }

            if(datos[i].HMGE !== 0){
                GEperf = datos[i].CMGE / datos[i].HMGE;
                array.push(GEperf);
            }else{
                array.push(0);
            }

            if(datos[i].HMGB !== 0){
                GBperf = datos[i].CMGB / datos[i].HMGB;
                array.push(GBperf);
            }else{
                array.push(0);
            }

            if(datos[i].HMBW !== 0){
                BWperf = datos[i].CMBW / datos[i].HMBW;
                array.push(BWperf);
            }else{
                array.push(0);
            }
            console.log(array);
            rows.push(array);
        }
        data.addRows(rows);

        var options = {
        title: "Vali",
        hAxis: {
          title: 'Day'
        },
        vAxis: {
          title: 'Performance (Galones/hora)'
        },
        //colors: ['#a52714', '#097138'],
        crosshair: {
          color: '#000',
          trigger: 'selection'
        }
        };

        var chart = new google.visualization.LineChart(document.getElementById('line_chart'));

        chart.draw(data, options);
        chart.setSelection([{row: 38, column: 1}]);
    },
    renderTable: function(report){
        var datos = {
            report: report.reportData,
            labels: report.labels
        };
        console.log(report.labels);
        var source = $("#table-info").html();
        var plantilla = Handlebars.compile(source);
        var html = plantilla(datos);
        $('#table_chart').html(html);
    }
};

$(document).ready(function(){
	controller.userconfig();
    controller.exportTable();
	console.log("Éxito!!");
});

window.LoadedCharts = function(){
    controller.reportData();
}

window.validReportRequest = function(){
    controller.validReportRequest();
}
