// walker.js

// Import the Package prototype object
var Package = require('./../models/package.js').Package;

var intervals = [];

// Event listener for child process
process.on('message', (msg) => {
  // msg should be delimited by pipes cmd|pkg|unit
  var cmd = msg.split('|');
  // Check command
  if (cmd[0] === 'stop') {
    console.log(`[${process.pid}] : stop msg received, stopping...`);
    // stop walking
    if (interval.length > 0) {
      clearInterval(intervals.pop());
    }
    console.log(`[${process.pid}] : walking stopped!`);
  }
  else if (cmd[0] === 'start') {
    console.log(`[${process.pid}] : start msg received, starting walk...`);
    // start walking from an orgin pkg
    try {
      var origin = JSON.parse(cmd[1]);
      // Recreate origin with prototype Package
      origin = new Package(origin.pkgId, origin.position, origin.velocity,
        origin.acceleration, origin.tempurature, origin.time);
      var unit = cmd[2];
      var dt = cmd[3];
      walk(unit, dt, origin);
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
* @param {number} unit Unit of lat/lon distance by which to walk
* @param {number} interval Inteval in ms to fire the step function
* @param {Package} origin Package with starting location
*/
function walk(unit, dt, origin) {
  console.log(JSON.stringify(origin));

  intervals.push(setInterval(() => {
    next = step(unit, dt, origin);
    process.send(JSON.stringify(next));
    origin = next;
  }, dt));
}

/**
* Creates a succeeding Package within a given unit distance of the provided Package randomly
* @param {number} unit
* @param {number} dt
* @param {Package} prev
*/
function step(unit, dt, prev) {
  // Use polar coordinates to find a <latitude, longitude> with unit as the radius from the origin (walking in 2D)
  // unit * <cos(theta), sin(theta)>

  // Choose a random value of theta on [0, 2*pi)
  var theta = Math.random() * 2 * Math.PI;
  // Calculate a new latitude and longitude and tessellate them by the values of the given pkg
  var lat = prev.position[0] + unit * Math.cos(theta);
  var lon = prev.position[1] + unit * Math.sin(theta);
  var nextPosition = [lat, lon, prev.position[2]];
  var nextVelocity = prev.findVelocity(nextPosition, dt);
  var nextAcceleration = prev.findAcceleration(nextVelocity, dt);

  // TODO: Handle edge cases where step is off map [-85, 85] x [-180, 180]
  var next = new Package( prev.pkgId, nextPosition, nextVelocity,
    nextAcceleration, 0, (new Date()).valueOf()
  );

  return next;
}

exports.step = step;
exports.walk = walk;
