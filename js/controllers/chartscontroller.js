var request = {
    getVesselsPosition: function () {
        getVesselsPosition(controller.setModel);
    }
};

var model = {
    vessels: {},
    options: {},
    setVessels: function (vessels) {
        this.vessels = vessels;
    },
    setOptions: function (options) {
        this.options = options;
    }
};

var controller = {
    setModel: function (datos) {
        model.setVessels(datos.vessels);
        model.setOptions(datos.options);
        controller.setChart(model.vessels);
    },
    setChart: function (vessels) {
        views.renderChart(vessels);
    }
};

var views = {
    renderChart: function (vessels) {
        try {
            var vessels = vessels;
            var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
            for (var i = 0, len = vessels.vessel.length; i < len; i++) {
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Vessel');
                data.addColumn('number', 'RPM');
                data.addRow([
                    vessels.vessel[i].vesselname,
                    parseFloat(vessels.vessel[i].rpm)
                ]);
                chart.draw(data);
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
};

function initialize() {
    request.getVesselsPosition();
    setInterval(request.getVesselsPosition, 60000);
}