function request() {
    try {
        $.post(
                "http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition",
                "SessionID=&GetData=",
                function (data) {
                    var datos = JSON.parse(data.childNodes[0].innerHTML);
                    console.log(datos);
                    return datos.vessels.vessel;
                }
        );
    } catch (err) {
        console.log(err);
    }
}