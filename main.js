// // Plots
// // TODO: Add navigation between dates.

//timeSeriesPlot('graphActivity', 'Activity', [],  {x_label:'Timestamp', y_label:'Activity'});
//timeSeriesPlot('graphTemperature', 'Temperature', [], {x_label:'Timestamp', y_label:'Temperature'});
//

// Socket Client
$(function() {
    var socket = io();
    socket.on('update-data', function (data) {
        console.log("Received new data");
        trace1 = {
            x: data.time,
            y: data.temperature,
            label: 'Temperature',
        }

        trace2 = {
            x: data.time,
            y: data.activity,
            label: 'Activity'
        }

        var str = data.temperature[data.temperature.length-1]
            + "C"
        document.getElementById('temperatureStatus').innerHTML =str;

        var str = data.activity[data.activity.length-1];
        document.getElementById('activityStatus').innerHTML =str;

//        updatePlot('#graphTemperature', [ trace1 ]);
//        updatePlot("#graphActivity", [ trace2 ]);
        areaPlot('graphTemperature', trace1)
        areaPlot('graphActivity', trace2)

        socket.emit('acknowledge-data', { my:'index.html received data!'});
    });

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