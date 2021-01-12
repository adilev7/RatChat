const path = require("path"); // Core module
const http = require("http");
const express = require("express");
const app = express();
const auth = require("./routes/auth");
const user = require("./routes/users");
const room = require("./routes/rooms");
const message = require("./routes/messages");

require("./config/db.config")()
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.log("Could not connect to MongoDB"));

// Usually http.createServer() is not needed because express does it anyway,
// but since we are going to use socket.io, it's important to do it this way.
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set 'public' as static folder
app.use(express.static(path.join(__dirname, "public"))); // --> __dirname/public

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/room", room);
app.use("/api/message", message);

// Run when a client connects (on connection event).
io.on("connection", (socket) => require("./services/ws.service")(io, socket));

const PORT = process.env.PORT || 3500;
// Use server.listen() instead of app.listen() for the purpose of socket.io
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
