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
    var fecha = new Date(date), actual = new Date();
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