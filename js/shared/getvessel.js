var $ = require('jquery');
module.exports = function getVessel(callback, id) {
    try {
        $.get("../jsons/getVessel.json",// /id,
                {SessionID: "", GetData: ""})
                .done(function (data) {
                    var datos = data;
                    //var datos = data.childNodes[0].childNodes[0].nodeValue;
                    //datos = JSON.parse(datos);
                    callback(datos);
                    return datos;
                });
    } catch (err) {
        console.log(err);
        throw err;
    }
}