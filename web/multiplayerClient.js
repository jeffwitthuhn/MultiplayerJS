var MultiplayerClient = {
  gameStateArray: [],
  socket: null,
  WsServer: null,

  init: function(server) {
    this.socket = new WebSocket('ws://localhost:8080');
  },

  updatePos: function() {

  }

  receive: function() {
    this.socket.onmessage = function(e) {
      var data = JSON.parse(e.data);
      switch (data.type) {
        case "update":
          gameStateArray.push(data.gameState);
      }
    }
  }
};
