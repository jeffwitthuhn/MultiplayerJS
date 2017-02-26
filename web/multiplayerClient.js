var ws = new WebSocket('ws://localhost:8080');
ws.onmessage = function (event) {
  console.log(event.data);
};
console.log("hello");