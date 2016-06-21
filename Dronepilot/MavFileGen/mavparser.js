/**
Autor: Peter Weßeler
*/

exports.MAV_CMD = {

  MAV_CMD_NAV_WAYPOINT: {
    cmd: 16,
    hold_time: 0.0,
    /*Hold time in decimal seconds. (ignored by fixed wing, time to stay at MISSION for rotary wing)*/
    accep_radius: 0.5,
    /*Acceptance radius in meters (if the sphere with this radius is hit, the MISSION counts as reached)*/
    pass_through: 0.0,
    /*0 to pass through the WP, if > 0 radius in meters to pass by WP. Positive value for clockwise orbit, negative value for counter-clockwise orbit. Allows trajectory control.*/
    yaw_angle: 360.0,
    /*Desired yaw angle at MISSION (rotary wing)*/
    lat: 57.323,
    /*Latitude*/
    long: 7.327172,
    /*Longitude*/
    alt: 1,
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
  },
  MAV_CMD_NAV_LAND_LOCAL: {
    cmd: 23,
    landing_target: 0.0,
    /*Landing target number (if available)*/
    max_offset: 0.0,
    ///:TODO
  }

};


exports.MavParser = function(coordinates, filename, altitude, jobname) {
  this.coordinates = coordinates;
  this.filename = filename;
  this.altitude = altitude;
  this.fileIO = require("fs");
  this.objectValues = require('object-values');
  this.mavWayPoints = [];
  this.writer = {};
  this.mavLand = exports.MAV_CMD.MAV_CMD_NAV_LAND;
  this.mavCamOn = exports.MAV_CMD.MAV_CMD_VIDEO_START_CAPTURE;
  this.mavCamOff = exports.MAV_CMD.MAV_CMD_VIDEO_STOP_CAPTURE;
  this.index = 0;
};
exports.MavParser.prototype.genMavLinkwaypointObj = function() {
  var waypoint_ar = this.coordinates;
  var value = [];
  for (var i = 0; i < waypoint_ar.length; i++) {
    var waypointobj = JSON.parse(JSON.stringify(exports.MAV_CMD.MAV_CMD_NAV_WAYPOINT));
    value = this.objectValues(waypoint_ar[i]);
    waypointobj.lat = value[0];
    waypointobj.long = value[1];
    this.mavWayPoints.push(waypointobj);
  }
  this.mavLand.lat = value[0];
  this.mavLand.long = value[1];
  console.log(this.mavWayPoints);

};
exports.MavParser.prototype.startparse = function() {
  this.writer = this.fileIO.createWriteStream(this.filename + '.mavlink');
  this.writer.write("QGC WPL 120\n");
  this.genMavLinkwaypointObj();
  this.start();
};
exports.MavParser.prototype.closeFile = function() {
  this.writer.end();
};
exports.MavParser.prototype.writeMAVCMD = function(mavcmd) {
  var values = this.objectValues(mavcmd);
  this.writer.write(this.index + "\t0\t3\t" + values[0] + "\t");
  for (var i = 1; i < values.length; i++) {
    this.writer.write(parseFloat(values[i]).toFixed(6) + "\t");
  }
  this.index += 1;
  this.writer.write("1\n");

};
exports.MavParser.prototype.start = function() {
  this.writeMAVCMD(this.mavCamOn);
  this.writeWaypoints();
};
exports.MavParser.prototype.writeWaypoints = function() {

  for (var i = 0; i < this.mavWayPoints.length; i++) {
    this.writeMAVCMD(this.mavWayPoints[i]);
  }
  this.endparse();
};
exports.MavParser.prototype.endparse = function() {
  this.writeMAVCMD(this.mavLand);
  this.writeMAVCMD(this.mavCamOff);
  this.closeFile();
};


/*
var mavpaser = new MavParser(coordinates, 'flightPlan', 3, 'year');
mavpaser.startparse();
console.log("test");

/*console.log(objectValues(test));*/
