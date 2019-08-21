#!/usr/bin node
const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const url = require('url');
const fs = require('fs');

const {getNewestDataFile, listDataDir, parseFile} = require('./parse_data.js');


// Initialise https Server and home page
http.listen(6969, function() {
    console.log('listening on *:6969')
});
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});
app.use(express.static(__dirname));


// function for parsing sensor data
var sensorData = {};
async function parseFiles(file) {
    sensorData = await parseFile(file);
}


// Socket.io setup
io.on('connection', function(socket) {
    console.log('a user connected');

    // get latest datafile and parse
    parseFiles(getNewestDataFile())
    socket.emit('update-data', sensorData);

    // get latest datafile and parse

    socket.on('get-new-data', function(){
        parseFiles(getNewestDataFile())
        socket.emit('update-data', sensorData);
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
