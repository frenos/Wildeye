var socket = io();

var vm = new Vue({
  el: '#app',
  data: {
    pages: {},
    referrers: {},
    battery: 0
  },
  created: function() {
    socket.on('update-data', function(data) {
            this.battery = data.battery;
    }.bind(this));
  }
});
