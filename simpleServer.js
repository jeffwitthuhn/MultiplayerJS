
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
app.use(express.static(path.join(__dirname, '/web')));
server.on('request', app);
server.listen(8000, function () {
  console.log('Listening on http://localhost:8000');
});


var playerSpeed = 1; 

var MultiplayerServer = require('./multiplayerServer.js');

function handleAction(pid, action) {

}

function processInput(pid, inputs) {
  var direction = {x:0, y:0}; 
  for(var input in inputs) {
    switch(input.type) {
      case 'movement': 
        direction.x += input.direction.x;
        direction.y += input.direction.y;
        direction.z += input.direction.z;
      break;
      case 'shoot':
      break;  
    }
  }
  movePlayer(pid, direction);
}

function movePlayer(pid, direction) {
  var previousPos= MultiplayerServer.gameState.players[pid].position;
  previousPos.x += direction.x * playerSpeed; 
  previousPos.y += direction.y * playerSpeed; 
}

function serverPlayerShoot(pid, shotInfo) {

}

var playerObjTemplate = {
  pid: -1,
  position: {
    x:0, y:0
  }
}

MultiplayerServer.init(server, handleAction, playerObjTemplate, processInput);

