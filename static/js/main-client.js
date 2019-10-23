// // Plots
// // TODO: Add navigation between dates.

var debug_;
$(function() {
  "use strict";

  // Socket Client
  var socket = io();
  socket.on('update-data', function (sensorData) {
    console.log("Received new data");
    debug_ = sensorData;

    // Update cards
    var len = sensorData.time.length-1;
    var str = sensorData.temperature[len] + " C"
    document.getElementById('temperatureStatus').innerHTML = str;
    var str = sensorData.activity[len];
    document.getElementById('activityStatus').innerHTML = str;

    // Update plots
    areaPlot('graphTemperature', sensorData.time, sensorData.temperature, 'Temperature (°C)')
    areaPlot('graphActivity', sensorData.time, sensorData.activity, 'Activity (count)')

    // Acknowledge data to the server
    socket.emit('acknowledge-data', { my:'index.html received data!'});
  });

  socket.emit('get-new-data');
  console.log("asking for data");

  $('form').submit(function(e){
    e.preventDefault(); // prevent page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  $('#refresh-data').click(function() {
    socket.emit('get-new-data');
    console.log("asking for data");
  });

  $('#back-button').click(function() {
    socket.emit('get-back-data');
    console.log("back button");
  });

  $('#next-button').click(function() {
    socket.emit('get-next-data');
    console.log("next button");
  });
})
