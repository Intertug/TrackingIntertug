var request = {
    getVessels: function (callback) {
        getVesselsPosition(callback);
    },
};

var model = {
    vessels: {},
    options: {},
    serverDate: {},
    setVessels: function (vessels) {
        this.vessels = vessels;
    },
    setOptions: function (options) {
        this.options = options;
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
        var mes = divDate[1] - 1;
        var dia = divDate[2];
        var hora = divTime[0];
        var minutos = divTime[1];
        var segundos = divTime[2];
        var fecha = new Date(año, mes, dia, hora, minutos, segundos);
        return fecha;
    },
    setVesselsInfo: function (datos) {
        model.setVessels(datos.vessels);
        model.setOptions(datos.options);
        model.setServerDate(datos.vessels.actualdate);
        views.renderHandlebar(model.vessels);
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
            if (diferenciaEnMinutos >= 30) {
                return "danger";
            } else {
                return "";
            }
        });

        Handlebars.registerHelper("isOverSpeedTop", function (vessel) {
            if (vessel.id == 5) {
                if (parseFloat(vessel.speed) > 8)
                    return "danger";
            } else if (parseFloat(vessel.speed) > 9) {
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
    renderHandlebar: function (vessels) {
        var vessels = vessels;
        views.showDivRow = false;
        var plantilla = Handlebars.compile(views.templateForHandlebar);
        var html = plantilla(vessels);
        $('#map-container').html(html);
    }
};

function initialize() {
    views.registerHelpers();
    controller.getVessels();
    setInterval(controller.getVessels, 60000);
}
