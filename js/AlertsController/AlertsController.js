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
    var mes = fecha1[1] - 1;
    var dia = fecha1[2];
    var hora = fecha2[0];
    var minutos = fecha2[1];
    var segundos = fecha2[2];
    var fecha = new Date(año, mes, dia, hora, minutos, segundos), actual = new Date();
    var diferenciaEnMinutos = Math.abs((actual - fecha) / 60000);
    if (diferenciaEnMinutos >= 30) {
        return "list-group-item-danger";
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