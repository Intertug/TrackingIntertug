function getCcomRequest(callback) {
    try {
        $.get("../jsons/getVesselsPosition.json",
                {SessionID: "", GetData: ""})
                .done(function (data) {
                    console.log(data);
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