function initCharts() {
    getVesselsPosition(drawChart);
    setInterval(getVesselsPosition, 60000, drawAddChart);
}

function drawChart(vessels) {
    try {
        for (i = 0; i < vessels.vessel.length; i++) {
            var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Vessel');
            data.addColumn('number', 'RPM');
            data.addRow([
                vessels.vessel[i].vesselname,
                parseFloat(vessels.vessel[i].rpm),
            ]);
            chart.draw(data);
        }
    } catch (e) {
        throw e;
    }
}

function drawAddChart(vessels){
    
}