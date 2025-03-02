/* eslint-disable */
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const ws = require('ws');

const port = 1883; // Port MQTT
const wsPort = 8080; // Port WebSocket

server.listen(port, function () {
  console.log(`MQTT broker is running on port ${port}`);
});

// WebSocket support
const wsServer = new ws.Server({ port: wsPort });
wsServer.on('connection', function (socket) {
  const stream = require('stream');
  const duplex = new stream.Duplex({
    read(size) {},
    write(chunk, encoding, callback) {
      socket.send(chunk, encoding, callback);
    },
  });

  duplex.on('data', (data) => socket.send(data));
  socket.on('message', (message) => duplex.push(message));
  socket.on('close', () => duplex.destroy());

  aedes.handle(duplex);
});

console.log(`WebSocket MQTT broker is running on port ${wsPort}`);
