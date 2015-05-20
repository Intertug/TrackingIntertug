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
    validReportRequest: function(){
        var dateone, datetwo, rm;
        var valid = true;
        var today = new Date();
        rm = document.getElementById("rm").selectedIndex;
        dateone = document.getElementById("dateone").value;
        datetwo = document.getElementById("datetwo").value;
        if(rm == null || rm == 0){
            valid = false;
        }
        dateoneDate = new Date(dateone);
        if(dateoneDate == " " || dateoneDate > today){
            valid = false;
        }
        datetwoDate = new Date(datetwo);
        if(datetwoDate == " " || datetwoDate > today){
            valid = false;
        }
        if(dateoneDate > datetwoDate){
            valid = false;
        }
        return valid;
    },
    requestReport: function(){
        console.log("generate report");
        rm = document.getElementById("rm").selectedIndex;
        dateone = document.getElementById("dateone").value;
        datetwo = document.getElementById("datetwo").value;
        request.getReport(rm,dateone, datetwo, controller.generateReport);
    },
    generateReport: function(datos){
        console.log(datos);
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
    drawCharts: function(){
      var data = new google.visualization.DataTable();
      data.addColumn('timeofday', 'Time of Day');
      data.addColumn('number', 'Motivation Level');

      data.addRows([
        [{v: [8, 0, 0], f: '8 am'}, 1],
        [{v: [9, 0, 0], f: '9 am'}, 2],
        [{v: [10, 0, 0], f:'10 am'}, 3],
        [{v: [11, 0, 0], f: '11 am'}, 4],
        [{v: [12, 0, 0], f: '12 pm'}, 5],
        [{v: [13, 0, 0], f: '1 pm'}, 6],
        [{v: [14, 0, 0], f: '2 pm'}, 7],
        [{v: [15, 0, 0], f: '3 pm'}, 8],
        [{v: [16, 0, 0], f: '4 pm'}, 9],
        [{v: [17, 0, 0], f: '5 pm'}, 10],
      ]);

      var options = {
        title: 'Motivation Level Throughout the Day',
        hAxis: {
          title: 'Time of Day',
          format: 'h:mm a',
          viewWindow: {
            min: [7, 30, 0],
            max: [17, 30, 0]
          }
        },
        vAxis: {
          title: 'Rating (scale of 1-10)'
        },
        width: "100%",
        height: "100%"
      };

      var chart = new google.visualization.ColumnChart(
        document.getElementById('bar_chart'));

      chart.draw(data, options);
    }
};

function initialize(){
	controller.userconfig();
	console.log("Éxito!!");
}