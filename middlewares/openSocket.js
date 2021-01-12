const formatMessage = require("../utils/message");

module.exports = (io, socket, req, res, next) => {
  socket.on("roomJoin", () => {
    /* EMIT FROM THE SERVER WILL EMIT TO THE CLIENT SIDE AND EMIT FROM THE CLIENT WILL EMIT TO THE SERVER SIDE (same functions on both sides) */
    // socket.emit() - emits only to the client that has connected.

    socket.emit("message", formatMessage(false, "Welcome To RatChat!"));

    // socket.broadcast.emit() - emits to all clients except the client that has connected.
    socket.broadcast.emit(
      "message",
      formatMessage(false, `${user} has joined the chat`)
    );

    // Run when a client disconnects (on disconnect event).
    socket.on("disconnect", () => {
      // io.emit() - emits to all the clients.
      io.emit("message", formatMessage(false, `${user} has left the chat`));
    });
  });

  socket.on("chatMessage", ({ user, msg }) => {
    io.emit("message", formatMessage(user, msg));
  });
};
