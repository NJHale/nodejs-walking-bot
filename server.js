// server.js

// Import required modules
var cp = require('child_process');
var mqtt = require('mqtt');

var Package = require('./models/package.js').Package;

// Collect relative environment variables
const MQTT_ADDR = 'localhost';//'localhost';//process.env.mqtt_addr;
const MQTT_TOPIC = 'pkgTopic';//'outTopic';//process.env.mqtt_topic;

const PKG_UNIT = .0001;//process.env.pkg_unit;
const PKG_INTERVAL = 500;//process.env.pkg_interval;
const PKG_ORIGIN = [41.071350, -74.112442, 0];//process.env.pkg_origin;

// Connect to the MQTT broker
var client = mqtt.connect(`tcp://${MQTT_ADDR}`);// ec2-54-227-228-246.compute-1.amazonaws.com

// Listen for connect event and send a hello world to the topic
client.on('connect', () => {
    console.log('Hello World!');
    try {
        console.log('connecting!');
        client.publish(MQTT_TOPIC, 'Hello MQTT - I\'m the nodejs-walking-bot!');
    } catch (e) {
        console.log(`problem detected in connect... ${e}`);
    }
});

// Instantiate a Package at the given origin position
var origin = new Package (0, PKG_ORIGIN, [0, 0, 0], [0, 0, 0], 0, (new Date()).valueOf());
// Create a msg to start the child thread
var startMsg = `start|${JSON.stringify(origin)}|${PKG_UNIT}|${PKG_INTERVAL}`;
console.log(startMsg);
// Fork and store a child process
var fork = cp.fork('./worker/walker').on('message', (msg) => {
  console.log(`msg: ${msg}`);
  //var next = JSON.parse(msg);
  // {"gps_pkg":"41.071350,-74.112442,4566.6,34,4"}
  try {
    console.log(`publishing to ${MQTT_TOPIC}` + msg);
    client.publish(MQTT_TOPIC, msg);
    console.log('outTopic published!');
  } catch (err) {
    console.log(`An error occurred when attempting to public to outTopic: ${err}`);
  }

})
// Send the message to start
console.log('sending start msg...');
fork.send(startMsg);
console.log('start msg sent!');
// Send a stop message in 10 seconds
setTimeout(() => { fork.send('stop') }, 4000000);
