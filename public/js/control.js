(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
 google.setOnLoadCallback(drawGauge);

 var gaugeOptions = {
     min: 0,
     max: 280,
     yellowFrom: 200,
     yellowTo: 250,
     redFrom: 250,
     redTo: 280,
     minorTicks: 5
 };
 var gauge;

 function drawGauge() {
     gaugeData = new google.visualization.DataTable();
     gaugeData.addColumn('number', 'Velocidad');
     gaugeData.addColumn('number', 'RPM');
     gaugeData.addRows(2);
     gaugeData.setCell(0, 0, 0.2);
     gaugeData.setCell(0, 1, 80);

     gauge = new google.visualization.Gauge(document.getElementById('gauge_div'));
     gauge.draw(gaugeData, gaugeOptions);
 }

 function changeTemp(dir) {
     gaugeData.setValue(0, 0, gaugeData.getValue(0, 0) + dir * 25);
     gaugeData.setValue(0, 1, gaugeData.getValue(0, 1) + dir * 20);
     gauge.draw(gaugeData, gaugeOptions);
 }
},{}]},{},[1])