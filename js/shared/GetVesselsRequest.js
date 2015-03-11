function getVesselsRequest(callback) {
    try {
        $.post("http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition",
                {SessionID: "", GetData: ""})
                .done(function (data) {
                    console.log(data);
                    var datos = data.childNodes[0].childNodes[0].nodeValue;
                    datos = JSON.parse(datos);
                    datos.vessels.actualdate = datos._dte;
                    var vessels = datos.vessels;
                    console.log(vessels);
                    callback(vessels);
                });
    } catch (err) {
        console.log(err);
        throw err;
    }
}