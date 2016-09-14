// server.js

// Import required modules
var cp = require('child_process');
var mqtt = require('mqtt');

var Package = require('./models/package.js').Package;

// Collect relative environment variables
const MQTT_PKG_HOST = process.env.MQTT_PKG_HOST || 'localhost',
      MQTT_PKG_TOPIC = process.env.MQTT_PKG_TOPIC || 'pkgTopic';

// Connect to the MQTT broker
var client = mqtt.connect(`tcp://${MQTT_PKG_HOST}`);// ec2-54-227-228-246.compute-1.amazonaws.com

// Listen for connect event and send a hello world to the topic
client.on('connect', () => {
    console.log('Hello World!');
    try {
        console.log('connecting!');
        client.publish(MQTT_PKG_TOPIC, 'Hello MQTT - I\'m the nodejs-walking-bot!');
    } catch (e) {
        console.log(`problem detected in connect... ${e}`);
    }
});

// Fork and store a child process
var fork = cp.fork('./worker/walker').on('message', (msg) => {
  // {"gps_pkg":"41.071350,-74.112442,4566.6,34,4"}
  try {
    console.log(`Publishing to ${MQTT_PKG_TOPIC} : ${msg}`);
    client.publish(MQTT_PKG_TOPIC, msg);
    console.log('Message published!');
  } catch (err) {
    console.log(`An error occurred when attempting to public to outTopic: ${err}`);
  }

})


const PKG_COUNT = process.env.PKG_COUNT || 1,
      PKG_ORIGIN = [41.071350, -74.112442, 0];//process.env.pkg_origin;

for (var i = 0; i < PKG_COUNT; i++) {
  const PKG_UNIT = Math.random() * (.049 - .001) + .001;//process.env.pkg_unit; [.001, .05]
  const PKG_INTERVAL = Math.floor(Math.random() * (2500 - 250) + 250);//process.env.pkg_interval;
  // Instantiate a Package at the given origin position
  var origin = new Package (Math.floor(Math.random() * 100), PKG_ORIGIN, [0, 0, 0], [0, 0, 0], 0, (new Date()).valueOf());
  // Create a msg to start the child thread
  var startMsg = `start|${JSON.stringify(origin)}|${PKG_UNIT}|${PKG_INTERVAL}`;
  console.log(startMsg);
  // Send the message to start
  console.log('sending start msg...');
  fork.send(startMsg);
  console.log('start msg sent!');
}

// Send a stop message in 10 seconds
//setTimeout(() => { fork.send('stop') }, 4000000);
