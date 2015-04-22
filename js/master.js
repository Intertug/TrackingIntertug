var mapa;
function initmap() {
    var centro = new google.maps.LatLng(9.024365, -72.913396);
    var opciones = {
        zoom: 4,
        center: centro,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: true,
        streetViewControl: false,
        scaleControl: true,
        mapTypeControlOptions: {position: google.maps.ControlPosition.LEFT_TOP},
        zoomControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER},
        panControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER},
        scaleControlOptions: {position: google.maps.ControlPosition.BOTTOM_CENTER}
    };
    mapa = new google.maps.Map(document.getElementById("map-canvas"), opciones);
}