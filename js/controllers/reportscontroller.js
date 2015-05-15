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
	}
};

var model = {
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
};

function initialize(){
	controller.userconfig();
	console.log("Éxito!!");
}