function getVesselsRequest(callback) {
    try {
        $.post("http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition",
                {SessionID: "", GetData: ""})
                .done(function (data) {
                    var datos = data.childNodes[0].childNodes[0].nodeValue;
                    datos = JSON.parse(datos);
                    var vessels = datos.vessels;
                    callback(vessels);
                });
    } catch (err) {
        console.log(err);
        throw err;
    }

}