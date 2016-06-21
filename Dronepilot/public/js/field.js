var socket = io();
var atob = require('atob');
var Player = require('../../Broadway/Player/Player');
var player = new Player({
    useWorker: true,
    workerFile: '../js/Decoder.js',
    webgl: false
});

document.getElementById('vidstream').appendChild(player.canvas);

var toUint8Array = function(parStr) {
    var raw = atob(parStr);
    var array = new Uint8Array(new ArrayBuffer(raw.length));

    Array.prototype.forEach.call(raw, function(data, index) {
        array[index] = raw.charCodeAt(index);
    })
    return array;
};


var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data (c) <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {
    minZoom: 8,
    maxZoom: 20,
    attribution: osmAttrib
});

var map = L.map('map', {
        layers: [osm]
    })
    .setView([52.14227, 7.32899], 17);

var myMarkerClass = L.Icon.extend({
    options: {
        iconUrl: '../images/marker-icon.png',
        shadowUrl: '../images/marker-shadow.png'
    }
});
var myMarker = new myMarkerClass();

var marker;

function updateMarker(lat, lng) {
    zoom = 12;
    if (marker)
        map.removeLayer(marker);
    marker = L.marker([lat, lng], {
        icon: myMarker
    }).addTo(map);
    map.panTo([lat, lng], zoom);
}

var vm = new Vue({
    el: '#app',
    data: {
        gps: {
            lat: 51,
            long: 7
        },
        dronestate: "ready",
        battery: 0
    },
    created: function() {
        socket.on('battery-data', function(data) {
            this.battery = data;
        }.bind(this));

        socket.on('gps-data', function(data) {
            this.gps = data;
            updateMarker(this.gps['latitude'], this.gps['longitude']);
        }.bind(this));

        socket.on('dronestate-data', function(data) {
            this.dronestate = data;
        }.bind(this));

        socket.on('video-data', function(data) {
            player.decode(toUint8Array(data));
        });
        socket.emit('connect-drone', "");
    },
    methods: {
      startBtn: function(event){
        var pathArray = window.location.pathname.split( '/' );
        jobId = pathArray[pathArray.length-1];
        console.log("sending jobid "+jobId);
        socket.emit('start-button', jobId);
      },
      stopBtn: function(event){
        socket.emit('stop-button', jobId);
      },
    }
});
