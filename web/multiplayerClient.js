var MultiplayerClient = {
  game_state_array: [],
  server_updates: [],
  client_time: 0.01,
  server_time: 0.01,
  target_time: 0.01,
  net_offset: 100,
  socket: null,
  WsServer: null,

  init: function(server) {
    this.socket = new WebSocket('ws://localhost:8000');
    this.socket.onopen = this.clientConnected;
    this.socket.onclose = this.clientDisconnect;
    this.socket.onerror = this.clientDisconnect;
    this.socket.onmessage = this.clientMessageReceive;
  },

  updatePos: function() {

  },

  clientMessageReceive: function(e) {
    var data = JSON.parse(e.data);
    switch (data.type) {
      case "update":
        MultiplayerClient.server_updates.push(data);
        MultiplayerClient.game_state_array.push(data.gameState);
        MultiplayerClient.server_time = data.gameState.serverTime;
        MultiplayerClient.client_time = MultiplayerClient.server_time - (MultiplayerClient.net_offset/1000);
        // console.log(data.gameState);
        break;
      case "connect":
        console.log("new player:" + data.id);
        break;
    }
    MultiplayerClient.clientProcessUpdates();
  },

  clientConnected: function(e) {
    console.log('Player Connected');
  },

  clientDisconnect: function() {
    console.log('Player Disconnected');
  },

  clientProcessUpdates: function() {
    this.processNetUpdates();

  },

  processNetUpdates: function() {
    if(!this.game_state_array.length) return;

    var current_time = this.client_time;
    var count = this.game_state_array.length-1;
    var target = null;
    var previous = null;

    for(var i = 0; i < count; i++) {
      var point = this.game_state_array[i];
      var next_point = this.game_state_array[i+1];

      if (current_time > point.serverTime && current_time < next_point.serverTime) {
        target = next_point;
        previous = point;
        break;
      }
    }

    if(!target) {
      target = this.game_state_array[0];
      previous = this.game_state_array[0];
    }

    if(target && previous) {
      this.target_time = target.serverTime;
      var difference = this.target_time - this.current_time;
      var m_difference = (this.target_time - previous.serverTime);
      var time_point = (difference/m_difference);

      if(isNaN(time_point)) time_point = 0;
      if(time_point == -Infinity) time_point = 0;
      if(time_point == Infinity) time_point = 0;

      var latest_game_state = this.game_state_array[this.game_state_array.length-1];
    }
  }
};


MultiplayerClient.init();
