#!/usr/bin node
const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');


// Initialise https Server and home page
http.listen(6969, function() {
    console.log('listening on *:6969')
});
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});
app.use(express.static(__dirname));


// Connect to the database
let db = new sqlite3.Database('data/tiger-home.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});


// Socket.io setup
io.on('connection', function(socket) {
    console.log('a user connected');

    // get latest datafile and parse
    socket.on('get-new-data', function(){

        db.serialize(() => {
            let sensorData = {
                time: [],
                temperature: [],
                activity: [],
            };
            db.each("SELECT timestamp, temperature, activity FROM sensor_data ORDER BY timestamp DESC LIMIT 1500",
                function (err, row) {
                    if (err) { console.error(err.message); }
                    
                    sensorData.time.push(moment(row.timestamp * 1000).format('MM/DD/YY HH:mm'));
                    sensorData.temperature.push(row.temperature);
                    sensorData.activity.push(row.activity);
                }, function () {
                    socket.emit('update-data', sensorData);
                });
        });
    })

    socket.on('get-back-data', function() {
        // Do something here to parse old data
        socket.emit('update-data', sensorData);
    })
    
    socket.on('get-next-data', function() {
        // Do something here to parse new data
        socket.emit('update-data', sensorData);
    })
    
    socket.on('acknowledge-data', function (data) {
        console.log(data);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });


    // socket.on('chat message', function(msg) {
    //    console.log('message: ' + msg);
    // });
});
