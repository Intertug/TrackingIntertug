var templateForHandlebar = $('#vessels-info').html();
var actualServerDate;
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
    actualServerDate = vessels.actualdate;
    var html = plantilla(vessels);
    $('#map-container').html(html);
}


Handlebars.registerHelper("isOutdatedDate", function (date) {
    var fechaGps = stringToDate(date);
    var fechaActual = stringToDate(actualServerDate);
    var diferenciaEnMinutos = Math.abs((fechaActual - fechaGps) / 60000);
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

function stringToDate(date){
    //String to date function - Compatible con IE
    var divDateOfTime = date.split(' ');
    var divDate = divDateOfTime[0].split('-');
    var divTime = divDateOfTime[1].split(':');
    var año = divDate[0];
    var mes = divDate[1] - 1;
    var dia = divDate[2];
    var hora = divTime[0];
    var minutos = divTime[1];
    var segundos = divTime[2];
    var fecha = new Date(año, mes, dia, hora, minutos, segundos)
    return fecha;
}