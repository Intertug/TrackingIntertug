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


