var $ = require('jquery');
module.exports = function getVisualConfiguration(callback) {
    try {
        $.post("http://nautilus.intertug.com:8080/api/visualconfiguration")
            .done(function (data) {
                var datos = data;
                //var datos = data.childNodes[0].childNodes[0].nodeValue;
                //datos = JSON.parse(datos);
                callback(datos);
            });
    } catch (err) {
        console.log(err);
        throw err;
    }
}