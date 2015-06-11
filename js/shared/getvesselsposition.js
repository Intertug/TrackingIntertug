var $ = require('jquery');
module.exports = function getVesselsPosition(callback) {
    try {
        $.post("http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition",
                {SessionID: "", GetData: ""})
                .done(function (data) {
                    var datos = data.childNodes[0].childNodes[0].nodeValue;
                    datos = JSON.parse(datos);
                    datos.vessels.actualdate = datos._dte;
                    var vessels = datos.vessels;
                    var data = {
                        vessels: vessels,
                        options: datos
                    };
                    callback(data);
                    return data;
                });
    } catch (err) {
        console.log(err);
        throw err;
    }
}
