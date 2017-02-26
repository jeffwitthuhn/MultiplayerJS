var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
app.use(express.static(path.join(__dirname, '/web')));
server.on('request', app);
server.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});

const WebSocket = require('ws');

var MultiplayerServer = {
  gameState: null, 
  WsServer: 234, 
  playerIDCounter: 0,

  init: function(server) {
    this.WsServer = new WebSocket.Server({ server: server });
    this.gameState = {};
    this.gameState.players = {};
    this.playerIDCounter = 0; 

    this.WsServer.broadcast = 3;
    this.WsServer.broadcast = broadcast;

    this.WsServer.on('connection', onConnect);  
  }, 

  addPlayer: function(id) {
    gameState.players.id = {};
  }
};

function broadcast(data) {
  MultiplayerServer.WsServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

function onConnect(ws){
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.on('close', function () {
    console.log("closed");
  });

  ws.send('something');
  ws.id=MultiplayerServer.playerIDCounter;
  MultiplayerServer.WsServer.broadcast("player: " + MultiplayerServer.playerIDCounter + " connected")
  MultiplayerServer.playerIDCounter++;
}

MultiplayerServer.init(server);

