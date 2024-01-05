const express = require('express');
const { Client, Message } = require('azure-iot-device');
const Mqtt = require('azure-iot-device-mqtt').Mqtt;

const app = express();
const port = 3000;

const connectionString = 'HostName=smartheateriot.azure-devices.net;DeviceId=7CDFA11A3024;SharedAccessKey=yVKJf9hslNve2Cr1903sWsA2NwNCYswA5AIoTDStONc=';
const deviceClient = Client.fromConnectionString(connectionString, Mqtt);

deviceClient.open((err) => {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
  }
});

// Handle messages sent to the device
deviceClient.on('devices/7CDFA11A3024/messages/events/power', (msg) => {
  const messageText = msg.getData().toString();
  console.log('Received message: ' + messageText); // Log the received message to the terminal

  // Broadcast the received message to all connected clients (web browsers)
  io.emit('message', messageText);
});

// Handle errors
deviceClient.on('error', (err) => {
  console.error(err.message);
});

// Set up a simple web server using Express
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Serve a basic HTML page
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Set up Socket.IO for real-time communication between server and clients
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A client connected');
});
