var MultiplayerServer = require('./multiplayerServer.js');

var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
app.use(express.static(path.join(__dirname, '/web')));
server.on('request', app);
server.listen(8000, function () {
  console.log('Listening on http://localhost:8000');
});


MultiplayerServer.init(server);
