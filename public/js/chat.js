const socket = io();

socket.on("message", (receivedMessage) => {
  console.log(`Server: ${receivedMessage}`);
});
socket.on("newConnection", (receivedMessage) => {
  console.log(`Server: ${receivedMessage}`);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = e.target.elements.message.value;
  console.log({ data });
  console.log(socket);
  socket.emit("sendMessage", data, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log(`message delivered!`);
  });
});

document.querySelector("#share-location").addEventListener("click", (e) => {
  e.preventDefault();

  if (!navigator.geolocation) {
    alert("not supported by browser");
  }

  navigator.geolocation.getCurrentPosition((pos) => {
    console.log(pos, pos.coords.latitude);
    socket.emit(
      "sendMessage",
      "my location is : " + pos.coords.latitude,
      (message) => {
        console.log(`this message from server for ack: `, message);
      }
    );
  });
});
