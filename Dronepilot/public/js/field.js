
var socket = io();
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

var marker;

function updateMarker(lat, lng){
  console.log("updateMarker?");
      zoom = 12;
      if (marker)
        map.removeLayer(marker);
      marker = L.marker([lat, lng],{}).addTo(map);
      map.panTo([lat,lng], zoom);
}

var vm = new Vue({
  el: '#app',
  data: {
    gps: {
      lat: 51,
      long: 7
    },
    dronestate : "ready",
    battery: 0
  },
  created: function() {
    socket.on('battery-data', function(data) {
            this.battery = data;
    }.bind(this));

    socket.on('gps-data', function(data){
      this.gps = data;
      updateMarker(this.gps['latitude'],this.gps['longitude']);
    }.bind(this));

    socket.on('dronestate-data', function(data){
      this.dronestate = data;
    }.bind(this));

    socket.emit('connect-drone', "");
  }
});
