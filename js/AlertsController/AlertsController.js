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


Handlebars.registerHelper("alertafecha", function (date) {
    var fecha = new Date(date);
    var actual = new Date();
    var bool = false;
    if (fecha.getFullYear() < actual.getFullYear()) {
        bool = true;
    } else if (fecha.getMonth() < actual.getMonth()) {
        bool = true;
    } else if (fecha.getDay() < actual.getDay()) {
        bool = true;
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
    } else {
        return "";
    }
});

Handlebars.registerHelper("alertavelocidad", function (vessel) {
    var bool = false;
    if (vessel.id == 5) {
        if (parseFloat(vessel.speed) > 8)
            bool = true;
    } else if (parseFloat(vessel.speed) > 9){
        bool = true;
    } else {
        bool = false;
    }
    if(bool){
        return "list-group-item-danger";
    }else{
        return "";
    }
});