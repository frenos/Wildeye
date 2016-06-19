var socket = io();

var vm = new Vue({
  el: '#app',
  data: {
    fieldlist: {},
    referrers: {},
    battery: 0
  },
  created: function() {
    socket.on('fields-data', function(data) {
          console.log(data);
            this.fieldlist = data;
    }.bind(this));
  }
});
