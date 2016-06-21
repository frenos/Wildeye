var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http)
var path = require('path');
var config = require('./config.js');
var request = require('request');
var atob = require('atob');
var fileIO = require("fs");

var bebop = require('node-bebop')
var drone = bebop.createClient();
var CronJob = require('cron').CronJob;

var fakedata = false;

if (fakedata == true) {
    new CronJob("*/3 * * * * *", function() {
        console.log("DEBUG: sending random battery!");
        battery = Math.floor(Math.random() * 101);
        io.emit('battery-data', battery);

    }, null, true);

    new CronJob("*/15 * * * * *", function() {
        console.log("DEBUG: sending random state!");
        availablestates = drone.Common.allStates();
        choosenstate = Math.floor(Math.random() * availablestates.length);

        newstate = availablestates[choosenstate];
        io.emit('dronestate-data', String(newstate));

    }, null, true);

    new CronJob("*/4 * * * * *", function() {
        console.log("DEBUG: sending fake gps!");
        availablegps = [];
        availablegps.push([52.143147, 7.329341]);
        availablegps.push([52.143140, 7.326836]);
        availablegps.push([52.1475281, 7.3379673]);
        availablegps.push([52.1475381, 7.3379273]);
        availablegps.push([52.1475081, 7.3372673]);
        choosengps = Math.floor(Math.random() * availablegps.length);

        newgps = availablegps[choosengps];
        io.emit('gps-data', newgps);

    }, null, true);

}

drone.connect(function() {

    drone.MediaStreaming.videoEnable(1);
    //Signal on Batterychange
    drone.on('battery', function(data) {
        console.log("DEBUG sending battery: "+data+" %...");
        batteryData=data;
        io.emit('battery-data', batteryData);
    });
    // Signal landed and flying events.
    drone.on('landing', function() {
        console.log('LANDING');
        stateData = 'Landing';
        sendState();
    });
    drone.on('landed', function() {
        console.log('LANDED');
        stateData = 'Landed';
        sendState();
    });
    drone.on('takeoff', function() {
        console.log('TAKEOFF');
        stateData = 'TakeOFF';
        sendState();
    });

    drone.on('hovering', function() {
        console.log('HOVERING');
        stateData = 'Hovering';
        sendState();
    });
    drone.on('flying', function() {
        console.log('FLYING');
        stateData = 'Flying';
        sendState();
    });

    // Signal GPS change
    drone.on("PositionChanged", function(data) {
        console.log("DRONE-GPS got " + JSON.stringify(data));
        io.sockets.emit('gps-data', data);
    });

    drone.on('video', function(data) {
        console.log('sending video data');
        io.emit('video-data', data.toString('base64'));
    });
});

var myData = {};
var fieldData = {};

var stateData = 'Ready';
var batteryData = 0;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public/')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/list', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/fieldlist.html'));
});

app.get('/field/:id', function(req, res) {
    id = req.params.id;
    doConvert(fieldData[id].coordinates);
    res.sendFile(path.join(__dirname, 'views/field.html'));
});

io.on('connection', function(socket) {
    io.emit('fields-data', fieldData);
    io.emit('battery-data',batteryData);
    sendState();
    socket.on('create-testdata', function(data) {
        myData = data;
        io.emit('update-data', myData);
    });

    socket.on('connect-drone', function(data) {
        console.log("Got connect-drone...");
    });

    socket.on('start-button', function(data){
        console.log("got buttonevent from job "+data);
    });


    socket.on('disconnect', function() {});
});

function sendState() {
    console.log('DEBUG: sending new STATE: ' + stateData);
    io.emit('dronestate-data', stateData)
}

function doConvert(coordinates) {
    console.log("TODO: convertStuff: " + coordinates);
}

new CronJob("*/5 * * * * *", function() {
    console.log("DEBUG: refreshing field list...");
    request('http://codepotion.de:8080/jobs', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonObject = JSON.parse(body);
            if (fieldData.length != jsonObject.length) {
                console.log("DEBUG: sending new field list to socket!");
                fieldData = jsonObject;
                fileIO.writeFile('jobs.json', JSON.stringify(fieldData),function(err){
                  if(err) return console.log(err);
                })
                io.emit('fields-data', fieldData);
            }
        }
        else {
          fileIO.readFile('jobs.json','utf8', function(err,data){
            if (err) return console.log(err);
            fieldData = JSON.parse(data);
          })
        }
    })
}, null, true);


http.listen(app.get('port'), function() {
    console.log('listening on *:' + app.get('port'));
});
