// production? no dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// app maker
const express = require("express");
// home router
const homeRouter = require("./routers/homeRouter.js");
// error
const Middleware = require("./middleware.js");
// allow all access
const cors = require("cors");

// create app
const app = express();
app.use(cors());

// socket.io
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
// handle signals
io.on("connection", (socket) => {
  // log connected user
  if (process.env.NODE_ENV !== "production") {
    console.log(`user connected: ${socket.id}.`);
  }

  // join room
  socket.on("join_room", (room) => {
    // log
    if (process.env.NODE_ENV !== "production") {
      console.log(`"join_room" received in backend: ${room}.`);
    }
    socket.join(room);
  });

  // send message (can make more of this)
  socket.on("send_message", (data) => {
    // log
    if (process.env.NODE_ENV !== "production") {
      console.log(`"send_message" received in backend: ${data}.`);
    }
    const { room, chats } = data;
    // log
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `backend emit "send_message" to room: ${room}. sending data: ${data}.`
      );
    }
    socket.to(room).emit("send_message", chats);
  });
});

// middlewares
app.use(express.urlencoded({ extended: true })); // req.body
app.use(express.json()); // for reading jest req
app.use(homeRouter); // enter home router
app.use(Middleware.error); // dump all err here
app.use(express.static("public")); // use public folder

// export
module.exports = { app, server };
