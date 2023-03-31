const express = require("express");
const app = express();
const server = require("http").createServer(app);
const morgan = require("morgan");
const helmet = require("helmet");

app.use(morgan("dev"));
app.use(helmet());

const socketPort = 3003;

const io = require("socket.io")(server, {
  cors: {
    origin: `*`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(socketPort, () => {
  console.log(`socket server is running on port ${socketPort}`);
});
