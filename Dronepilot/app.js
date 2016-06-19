var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http)
var path = require('path');
var config = require('./config.js');
var request = require('request');

var CronJob = require('cron').CronJob;

new CronJob("*/3 * * * * *", function() {
    console.log("DEBUG: sending random battery!");
        battery=Math.floor(Math.random() * 101);
        io.emit('battery-data', battery);

}, null, true);

new CronJob("*/15 * * * * *", function() {
    console.log("DEBUG: sending random state!");
        availablestates = ["ready", "crashed", "hovering", "landed"];
        choosenstate=Math.floor(Math.random()*availablestates.length);

        newstate = availablestates[choosenstate];
        io.emit('dronestate-data', newstate);

}, null, true);

var myData = {};
var fieldData = {};

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public/')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

app.get('/list', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/fieldlist.html'));
});

app.get('/field/:id', function(req,res){
  res.sendFile(path.join(__dirname, 'views/field.html'));
});

io.on('connection', function(socket) {
    if (socket.handshake.headers.referer.indexOf(config.host + config.dashboardEndpoint) > -1) {
        io.emit('update-data', myData);
    }
    io.emit('fields-data', fieldData);
    socket.on('create-testdata', function(data) {
        myData = data;
        io.emit('update-data', myData);
    });
    socket.on('disconnect', function() {});
});

new CronJob("*/5 * * * * *", function() {
    console.log("DEBUG: refreshing field list...");
    request('http://codepotion.de:8080/jobs', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonObject = JSON.parse(body);
            if (fieldData.length != jsonObject.length) {
                console.log("DEBUG: sending new field list to socket!");
                fieldData = jsonObject;
                io.emit('fields-data', fieldData);
            }
        }
    })
}, null, true);


http.listen(app.get('port'), function() {
    console.log('listening on *:' + app.get('port'));
});
