const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const formatMessage = require("./message");
const users = require("./users");
const moment = require("moment");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let bot = "Message Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, category }) => {
    const user = users.userJoin(socket.id, username, category);
    console.log("USER JOINED", user.username);
    socket.join(user.category);
    socket.emit("message", {
      username: bot,
      time: moment().format("h:mm a"),
      text: `Welcome to room ${user.category}!`,
    });
    socket.broadcast.to(user.category).emit(
      "someoneJoined",
      `
        <div class="bg-info rounded-3 p-3 shadow mb-3">
              <p class="p-0 m-0 text-white">${bot} • ${moment().format(
        "h:mm a"
      )}</p>
              <p class="p-0 m-0 text-white">${username} joined the room.</p> 
        </div>
        `
    );
    io.to(user.category).emit(
      "roomsUsersServer",
      users.getRoomsUsers(user.category)
    );
  });

  socket.on("roomsUsersClient", (user) => {
    socket.emit("roomsUsersServer", users.getRoomsUsers(user.category));
  });

  socket.on("send_message", (data) => {
    socket.broadcast
      .to(data.category)
      .emit("recieve_message", formatMessage(data.username, data.message));
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
    const user = users.userLeave(socket.id);
    if (user) {
      io.to(user.category).emit(
        "message",
        formatMessage(bot, `${user.username} has left the room.`)
      );

      io.to(user.category).emit(
        "roomsUsersServer",
        users.getRoomsUsers(user.category)
      );
    }
  });
});

server.listen(3001);
