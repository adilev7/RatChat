const formatMessage = require("../utils/message");

module.exports = (io, socket) => {
  socket.on("roomJoin", ({ user, room }) => {
    socket.join(room._id);
    /* EMIT FROM THE SERVER WILL EMIT TO THE CLIENT SIDE AND EMIT FROM THE CLIENT WILL EMIT TO THE SERVER SIDE (same functions on both sides) */
    // socket.emit() - emits only to the client that has connected.

    socket
      .to(room._id)
      .emit("message", formatMessage(false, `Welcome To Room ${room._id}`));

    // socket.broadcast.emit() - emits to all clients except the client that has connected.
    socket
      .to(room._id)
      .broadcast.emit(
        "message",
        formatMessage(
          false,
          `${user.username} has joined the chat room ${room._id}`
        )
      );
    socket.to(room._id).on("chatMessage", ({ user, msg }) => {
      io.to(room._id).emit("message", formatMessage(user.username, msg));
    });
    // Run when a client disconnects (on disconnect event).
    socket.on("disconnect", () => {
      socket.leave(room._id);
      // io.emit() - emits to all the clients.
      io.to(room._id).emit(
        "message",
        formatMessage(
          false,
          `${user.username} has left the chat room ${room._id}`
        )
      );
    });
  });
};
