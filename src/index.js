const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = new express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

io.on("connection", (socket) => {
  console.log(`new Socket connection`);

  socket.emit("message", "Welcome to the ChatApp!");
  socket.broadcast.emit(
    "newConnection",
    `newConnection-broadcasr: ${socket.id}`
  );

  socket.on("disconnect", (socket) => {
    console.log(`${socket.id} is disconnected!! :(`);
    io.emit("message", `${socket.id} is disconnected!! :(`);
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("profanity is not allowed");
    }

    // callback to get acknowledgement of message received to client (sender)
    console.log(`new Message: `, message, `from: `, socket.id);
    socket.broadcast.emit("message", `-broadcast: ${message}`);

    // callback to get acknowledgement of message received to client (sender)
    callback("Delivered!!! Thanks");
  });
});

server.listen(port, () => {
  console.log(`server up and running on http://localhost:${port}/`);
});
