#!/usr/bin node
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');
const uuidv1 = require('uuid/v1')

const express = require('express')
const session = require('express-session')
const app = express();
const http = require('http').createServer(app);


// Connect to the database
let db = new sqlite3.Database('data/tiger-home.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});


// Initialise https Server and home page
http.listen(6969, function() {
    console.log('listening on *:6969')
});
app.use(express.static(__dirname));

function parseDB(count) {
    return new Promise(function(resolve, reject) {
        // Parse DB Data
        var cmd = `SELECT timestamp, temperature, activity FROM sensor_data ORDER BY timestamp DESC LIMIT ${count}`;
        db.serialize(() => {
            let sensorData = {
                time: [],
                temperature: [],
                activity: [],
            };
            db.each(cmd, function (err, row) {
                    if (err) { console.error(err.message); }
                    sensorData.time.push(moment(row.timestamp * 1000).format('MM/DD/YY HH:mm'));
                    sensorData.temperature.push(row.temperature);
                    sensorData.activity.push(row.activity);
                }, function () {
                    // Do something with sensorData
                    resolve(sensorData);
                }
            );
        })
    })
}

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/index.html')
});
app.get('/home_api', (req, res) => {
    return res.send("Get request to /home_api, uuid: "+uuidv1())
})
app.get('/home_api/get_curr_data', async function(req, res) {
    return parseDB(1000).then(function(result) {
        res.send(result);
    }, function(err) {
        console.log(err)
    })
})
app.get('/home_api/get_curr_data/:num', async function(req, res) {
    return parseDB(req.params.num).then(function(result) {
        res.send(result);
    }, function(err) {
        console.log(err)
    })
})
app.get('/emergency/:id', function (req, res, next) {
    var id = req.params.id;
    console.log('The id: ' + id);
});
