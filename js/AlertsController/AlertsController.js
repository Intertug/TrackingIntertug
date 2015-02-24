var templateForHandlebar = $('#vessels-info').html();

function initAlerts() {
    try {
        getVesselsRequest(compileHandlebar);
        setInterval(getVesselsRequest, 60000, compileHandlebar);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

function compileHandlebar(vessels, mapa) {
    var plantilla = Handlebars.compile(templateForHandlebar);
    var html = plantilla(vessels);
    $('#map-container').html(html);
}


Handlebars.registerHelper("alertafecha", function (date) {
    var fecha = new Date(date), actual = new Date(), bool = false;
    if (fecha.getFullYear() < actual.getFullYear()) {
        bool = true;
    } else if (fecha.getMonth() < actual.getMonth()) {
        bool = true;
    } else if (actual.getDate() - fecha.getDate() > 1) {
        bool = true;
    } else if (actual.getDate() - fecha.getDate() == 1) {
        bool = true;
        if (parseInt(actual.getHours()) == 0 && parseInt(fecha.getHours()) == 23) {
            bool = false;
        }
    } else if ((parseInt(actual.getHours()) - parseInt(fecha.getHours())) > 1) {
        bool = true;
    } else if ((parseInt(actual.getHours()) - parseInt(fecha.getHours())) == 1) {
        if ((parseInt(actual.getMinutes()) + (60 - parseInt(fecha.getMinutes()))) > 59) {
            bool = true;
        }
    } else {
        bool = false;
    }
    if (bool) {
        return "list-group-item-danger";
    }
});

Handlebars.registerHelper("alertavelocidad", function (vessel) {
    var bool = false;
    if (vessel.id == 5) {
        if (parseFloat(vessel.speed) > 8)
            bool = true;
    } else if (parseFloat(vessel.speed) > 9) {
        bool = true;
    } else {
        bool = false;
    }
    if (bool) {
        return "list-group-item-danger";
    } else {
        return "";
    }
});