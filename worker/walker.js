// walker.js

// Import the Location prototype object
var Location = require('./../models/location.js').Location;

// Interval of the walk function called by the 'start' command
var interval = null;

// Event listener for child process
process.on('message', (msg) => {
  // msg should be delimited by pipes cmd|location|unit
  var cmd = msg.split('|');
  // Check command
  if (cmd[0] === 'stop') {
    console.log(`[${process.pid}] : stop msg received, stopping...`);
    // stop walking
    if (interval != null) {
      clearInterval(interval);
      interval = null;
    }
    console.log(`[${process.pid}] : walking stopped!`);
  }
  else if (cmd[0] === 'start') {
    console.log(`[${process.pid}] : start msg received, starting walk...`);
    // start walking from an orgin location
    try {
      var origin = JSON.parse(cmd[1]);
      var unit = cmd[2];
      walk(unit, origin);
    } catch (err) {
      console.error(`[${process.pid}] : There was some issue attempting to start a walk with ${msg}`);
    }
    console.log(`[${process.pid}] : walk started!`);
  } else {
    console.log(`[${process.pid}] : Invalid command! - ${msg}`);
  }

})

/**
* Walks continuously over an unbounded region
*/
function walk(unit, origin) {
  interval = setInterval(() => {
    next = step(unit, origin);
    process.send(JSON.stringify(next));
    origin = next;
  }, 1500);
}

/**
* Creates a location within a given unit distance of the provided Location randomly
* @param {number} unit
* @param {Location} prev
*/
function step(unit, prev) {
  // Use polar coordinates to find a <latitude, longitude> with unit as the radius from the origin
  // unit * <cos(theta), sin(theta)>

  // Choose a random value of theta on [0, 2*pi)
  var theta = Math.random() * 2 * Math.PI;
  //console.log('theta: ' + theta);
  //console.log('unit: ' + unit);
  // Calculate a new latitude and longitude and tessellate them by the values of the given location
  var lat = prev.latitude + unit * Math.cos(theta);
  var lon = prev.longitude + unit * Math.sin(theta);
  // TODO: Handle edge cases where step is off map [-85, 85] x [-180, 180]
  var next = new Location( prev.pkgId, lat, lon, new Date());

  return next;
}

exports.step = step;
exports.walk = walk;
