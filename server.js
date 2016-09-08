// server.js

// Import required modules
var cp = require('child_process');
var Location = require('./models/location.js').Location;

var mqtt = require('mqtt');
var client = mqtt.connect('tcp://ec2-54-227-228-246.compute-1.amazonaws.com');// ec2-54-227-228-246.compute-1.amazonaws.com

client.on('connect', function () {
    console.log('Hello World!');
    try {
        console.log('connecting!');
        client.publish('outTopic', 'Hello mqtt - im am conected from azure node iot app !!');
    } catch (e) {
        console.log(`problem detected in connect... ${e}`);
    }
});

var origin = new Location (0, 41.071350, -74.112442, new Date());
var startMsg = `start|${JSON.stringify(origin)}|0.001`;
console.log("here's our start message: " + startMsg);

// Fork and store a child process
var fork = cp.fork('./worker/walker').on('message', (msg) => {
  console.log(`msg: ${msg}`);
  var next = JSON.parse(msg);
  // {"gps_location":"41.071350,-74.112442,4566.6,34,4"}
  try {
    //console.log('publishing to outTopic...' + `{"gps_location":"${next.latitude},${next.longitude},4566.6,34,4"}`);
    client.publish('outTopic', `{"gps_location":"${next.latitude.toFixed(6)},${next.longitude.toFixed(6)},4566.6,34,4"}`);
    console.log('outTopic published!');
  } catch (err) {
    console.log(`An error occurred when attempting to public to outTopic: ${outTopic}`);
  }

})
// Send the message to start
console.log('sending start msg...');
fork.send(startMsg);
console.log('start msg sent!');
// Send a stop message in 10 seconds
setTimeout(() => { fork.send('stop') }, 4000000);
