var templateForHandlebar = $('#vessels-info').html();

function initAlerts() {
    try {
        getVesselsRequest(compileHandlebar);
        setInterval(getVesselsRequest, 60000, compileHandlebar);
    } catch (err) {
        throw err;
    }
}

function compileHandlebar(vessels, mapa) {
    var plantilla = Handlebars.compile(templateForHandlebar);
    var html = plantilla(vessels);
    $('#map-container').html(html);
}


Handlebars.registerHelper("isOutdatedDate", function (date) {
    var fechita = date.split(' ');
    var fecha1 = fechita[0].split('-');
    var fecha2 = fechita[1].split(':');
    var año = fecha1[0];
    var mes = fecha1[1];
    var dia = fecha1[2];
    var hora = fecha2[0];
    var minutos = fecha2[1];
    var segundos = fecha2[2];
    var fecha = new Date(año, mes, dia, hora, minutos, segundos), actual = new Date();
    if (fecha.getFullYear() < actual.getFullYear()) {
        return "list-group-item-danger";
    } else if (fecha.getMonth() < actual.getMonth()) {
        return "list-group-item-danger";
    } else if (actual.getDate() - fecha.getDate() > 1) {
        return "list-group-item-danger";
    } else if (actual.getDate() - fecha.getDate() == 1) {
        return "list-group-item-danger";
        if (parseInt(actual.getHours()) == 0 && parseInt(fecha.getHours()) == 23) {
            return "";
        }
    } else if ((parseInt(actual.getHours()) - parseInt(fecha.getHours())) > 1) {
        return "list-group-item-danger";
    } else if ((parseInt(actual.getHours()) - parseInt(fecha.getHours())) == 1) {
        if ((parseInt(actual.getMinutes()) + (60 - parseInt(fecha.getMinutes()))) > 59) {
            return "list-group-item-danger";
        }
    } else {
        return "";
    }
});

Handlebars.registerHelper("isOverSpeedTop", function (vessel) {
    if (vessel.id == 5) {
        if (parseFloat(vessel.speed) > 8)
            return "list-group-item-danger";
    } else if (parseFloat(vessel.speed) > 9) {
        return "list-group-item-danger";
    } else {
        return "";
    }
});