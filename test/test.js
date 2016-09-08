// test.js
var assert = require('assert');
var cp = require('child_process');


// Import modules to test
var Location = require('./../models/location.js').Location;
var walker = require('./../worker/walker.js');

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});

describe('Walker', () => {
  describe('#step()', () => {
    it('should return some Location that\'s not null', (done) => {
      var origin = new Location (0, 0, 0, new Date());
      //var startMsg = `start|${JSON.stringify(origin)}|5`;
      //console.log("here's our start message: " + startMsg);
      console.log('stepping...');
      var next = walker.step(5, origin);
      console.log(`stepped! ${origin} -> ${next}`);
      done();
    });
  });

  describe('#walk()', () => {
    it('should walk for some time and stop', (done) => {
      var origin = new Location (0, 0, 0, new Date());
      var startMsg = `start|${JSON.stringify(origin)}|5`;
      console.log("here's our start message: " + startMsg);
      // Fork and store a child process
      var fork = cp.fork('./../worker/walker').on('message', (msg) => {
        console.log(`msg: ${msg}`);
      })
      // Send the message to start
      console.log('sending start msg...');
      fork.send(startMsg);
      console.log('start msg sent!');
      // Send a stop message in 10 seconds
      setTimeout(fork.send('stop'), 10000);
      console.log('yay, we stopped!');
      done();
    });
  });

});
