/**
Autor: Peter Weßeler
*/
var MAV_CMD = {

  MAV_CMD_NAV_WAYPOINT: {
    cmd: 16,
    hold_time: 0.0,
    /*Hold time in decimal seconds. (ignored by fixed wing, time to stay at MISSION for rotary wing)*/
    accep_radius: 0.5,
    /*Acceptance radius in meters (if the sphere with this radius is hit, the MISSION counts as reached)*/
    pass_through: 0.0,
    /*0 to pass through the WP, if > 0 radius in meters to pass by WP. Positive value for clockwise orbit, negative value for counter-clockwise orbit. Allows trajectory control.*/
    yaw_angle: 180.0,
    /*Desired yaw angle at MISSION (rotary wing)*/
    lat: 57.323,
    /*Latitude*/
    long: 7.327172,
    /*Longitude*/
    alt: 3,
    /*Altitude in meter */
  },
  MAV_CMD_NAV_LAND: {
    cmd: 21,
    abort_alt: 1.0,
    /*Abort Alt*/
    empty_1: 0.0,
    /*Empty*/
    empty_2: 0.0,
    /*Empty*/
    yaw_angle: 180,
    /*Desired yaw angle at MISSION (rotary wing)*/
    lat: 57.323,
    /*Latitude*/
    long: 7.327172,
    /*Longitude*/
    alt: 3.0,
    /*Altitude in meter */
  },
  MAV_CMD_VIDEO_START_CAPTURE: {
    cmd: 2500,

    camera_id: 0.0,
    /*Camera ID */
    fps: 30.00,
    /*Frames per seconds der aufnahme */
    res_mega: 2073600.00,
    /*Camera auflösung*/
    empty_1: 0.0,
    /*Empty*/
    empty_2: 0.0,
    /*Empty*/
    empty_3: 0.0,
    /*Empty*/
    empty_4: 0.0,

  },
  MAV_CMD_VIDEO_STOP_CAPTURE: {
    cmd: 2501,
    empty_1: 0.0,
    /*Empty*/
    empty_2: 0.0,
    /*Empty*/
    empty_3: 0.0,
    /*Empty*/
    empty_4: 0.0,
    /*Empty*/
    empty_5: 0.0,
    /*Empty*/
    empty_6: 0.0,
    /*Empty*/
    empty_7: 0.0,
    /*Empty*/
  }
};


var MavParser = function(coordinates, filename, altitude, jobname) {
  this.coordinates = coordinates;
  this.filename = filename;
  this.altitude = altitude;
  this.fileIO = require("fs");
  this.objectValues = require('object-values');
  this.mavWayPoints = [];
  this.writer = {};
  this.mavLand = MAV_CMD.MAV_CMD_NAV_LAND;
  this.mavCamOn = MAV_CMD.MAV_CMD_VIDEO_START_CAPTURE;
  this.mavCamOff = MAV_CMD.MAV_CMD_VIDEO_STOP_CAPTURE;
  this.index = 0;
};
MavParser.prototype.genMavLinkwaypointObj = function() {
  var waypoint_ar = this.coordinates.coordinates;
  var waypointobj = MAV_CMD.MAV_CMD_NAV_WAYPOINT;
  var value = [];
  for (var i = 0; i < waypoint_ar.length; i++) {
    value = this.objectValues(waypoint_ar[i]);
    waypointobj.lat = value[0];
    waypointobj.long = value[1];
    this.mavWayPoints.push(waypointobj);
  }
  this.mavLand.lat = value[0];
  this.mavLand.long  = value[1];
  //console.log(this.mavWayPoints);

};
MavParser.prototype.startparse = function() {
  this.writer = this.fileIO.createWriteStream(this.filename + '.mavlink');
  this.writer.write("QGC WPL 120\n");
  this.genMavLinkwaypointObj();
  this.start();
};
MavParser.prototype.closeFile = function() {
  this.writer.end();
};
MavParser.prototype.writeMAVCMD = function(mavcmd) {
  var values = this.objectValues(mavcmd);
  this.writer.write(this.index + "\t0\t3\t"+values[0]+"\t");
  for (var i = 1; i < values.length; i++) {
    this.writer.write(parseFloat(values[i]).toFixed(6) + "\t");
  }
  this.index += 1;
  this.writer.write("1\n");

};
MavParser.prototype.start = function () {
  this.writeMAVCMD(this.mavCamOn);
  this.writeWaypoints();
};
MavParser.prototype.writeWaypoints = function() {

  for (var i = 0; i < this.mavWayPoints.length; i++) {
    this.writeMAVCMD(this.mavWayPoints[i]);
  }
  this.endparse();
};
MavParser.prototype.endparse = function () {
  this.writeMAVCMD(this.mavLand);
  this.writeMAVCMD(this.mavCamOff);
  this.closeFile();
};
MavParser.prototype.mavlinkCMD_NAV = function(args) {

};
var coordinates = {
  "coordinates": [{
    "lat": 52.14287813929325,
    "lng": 7.327172756195068
  }, {
    "lat": 52.142535758134684,
    "lng": 7.327752113342285
  }, {
    "lat": 52.142535758134684,
    "lng": 7.328363656997681
  }, {
    "lat": 52.142739870296076,
    "lng": 7.328599691390991
  }, {
    "lat": 52.14299007102416,
    "lng": 7.328814268112183
  }, {
    "lat": 52.143220517819614,
    "lng": 7.328417301177978
  }, {
    "lat": 52.14345096342262,
    "lng": 7.327966690063476
  }, {
    "lat": 52.143503636535854,
    "lng": 7.327558994293212
  }, {
    "lat": 52.14329294370905,
    "lng": 7.327269315719604
  }, {
    "lat": 52.14304274468254,
    "lng": 7.3269689083099365
  }]
};
var mavpaser = new MavParser(coordinates, 'test', 3, 'year');
mavpaser.startparse();
console.log("test");

/*console.log(objectValues(test));*/
