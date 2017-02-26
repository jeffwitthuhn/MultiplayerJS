const WebSocket = require('ws');

var MultiplayerServer = {
  gameState: null, 
  WsServer: null, 
  playerIDCounter: 0,
  tickSpeed: 500, //time beteen server updates 
  timeElapsed: null,
  previousTime: null, 
  playerObjTemplate: {position: {x:0, y:0, z:0}},
  init: function(server, actionHandler, playerObjTemplate, inputHandler) {
    console.log("init");
    this.WsServer = new WebSocket.Server({ server: server });
    this.gameState = {};
    this.gameState.players = {};

    this.timeElapsed = new Date().getTime();
    this.previousTime = new Date().getTime();
    this.gameState.serverTime = 0; 
    setInterval(this.serverUpdate.bind(this), this.tickSpeed);

    this.WsServer.broadcast = broadcast;
    this.WsServer.on('connection', onConnect); 

    if(actionHandler) {
      this.handleAction = actionHandler;
    }

    if(playerObjTemplate) {
      this.playerObjTemplate = playerObjTemplate;
    }

    if(inputHandler) {
      this.handleInputs = inputHandler;
    }

  }, 

  addPlayer: function(id) {
    this.gameState.players[id] = JSON.parse(JSON.stringify(this.playerObjTemplate));
    this.gameState.players[id].pid = id;
  },

  handleInputs: function(pid, inputs){
  },

  handleAction: function(id, actionId, options) { 

  },

  serverUpdate: function() {
    this.timeElapsed = new Date().getTime() - this.previousTime;
    this.previousTime = new Date().getTime();
    this.gameState.serverTime += this.timeElapsed; 

    var message = {};
    message.type = "update";
    message.gameState = this.gameState;

    this.WsServer.broadcast(JSON.stringify(message));

  }, 


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
    console.log('received message from p'+ ws.id +': %s', message);
    var data = JSON.parse( message.data);
    switch (data.type) {
      case "updatePosition": 
        MultiplayerServer.updatePosition(ws.id, data.update); break;
      case "action": 
        MultiplayerServer.handleAction(ws.id, data.action, data.options); break;
      case "input": 
        MultiplayerServer.handleInputs(ws.id, data.inputs); break;

      }

  });

  ws.on('close', function () {
    console.log("lost connection to player: " + ws.id);
    delete MultiplayerServer.gameState.players[ws.id];
  });
  ws.id=MultiplayerServer.playerIDCounter;
  MultiplayerServer.playerIDCounter++;
  MultiplayerServer.addPlayer(ws.id);

  var connectMessage = {};
  connectMessage.type = "connect"; 
  connectMessage.id = ws.id; 
  ws.send(JSON.stringify(connectMessage));

  console.log("player "+ ws.id +": connected");
  var message = {};
  message.type = "PlayerConnected";
  message.string = "player: " + ws.id + " connected";
  MultiplayerServer.WsServer.broadcast(JSON.stringify(message));

}

module.exports = MultiplayerServer;
