function initAlerts() {
    try {
        getVesselsRequest(alertas, "mapa");
    } catch (err) {
        console.log(err);
    }
}

function alertas(vessels, mapa) {
    var fuente = $('#vessels-info').html();
    var plantilla = Handlebars.compile(fuente);
    var html = plantilla(vessels);
    $('#map-container').html(html);
}


Handlebars.registerHelper("alertafecha", function (gpsdate) {
    var fecha = new Date(gpsdate);
    var actual = new Date();
    var alerta = "<a class='list-group-item-danger'>" + gpsdate.fn(this) + "</a>";
    var alerta2 = "<a class=''>" + gpsdate.fn(this) + "</a>";
    if (fecha.getFullYear() < actual.getFullYear()) {
        return new Handlebars.SafeString(alerta);
    } else if (fecha.getMonth() < actual.getMonth()) {
        return new Handlebars.SafeString(alerta);;
    } else if (fecha.getDay() < actual.getDay()) {
        return new Handlebars.SafeString(alerta);;
    } else if ((parseInt(actual.getHours()) - parseInt(fecha.getHours())) > 1) {
        return new Handlebars.SafeString(alerta);;
    } else if ((parseInt(actual.getHours()) - parseInt(fecha.getHours())) == 1) {
        if ((parseInt(actual.getMinutes()) + (60 - parseInt(fecha.getMinutes()))) > 59) {
            return new Handlebars.SafeString(alerta);;
        }
    } else {
        return new Handlebars.SafeString(alerta2);
    }
});

Handlebars.registerHelper("alertafecha", function (vessel) {
    if (vessel.id == 5) {
        if (parseFloat(vessel.speed) > 8)
            return true;
    } else {
        if (parseFloat(vessel.speed) > 9)
            return true;
    }
    return false;
});