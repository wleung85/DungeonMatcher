const express = require("express");
const { createServer } = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const PORT = process.env.PORT || 5000

const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils")

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    const { name, room } = data;
    const { user, error } = addUser({ id: socket.id, name, room });

    if (error) {
      console.log(error);
      return;
    }

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, it's great to see you in here.`
    })

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has just landed to the room.`
    })

    socket.join(user.room);

    io.to(user.room).emit("room-data", {
      room: user.room,
      users: getAllUsers(user.room),
    })
  })

  socket.on("send-message", (message) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", {
      user: user.name,
      text: message
    });

    io.to(user.room).emit("room-data", {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
  })
});

app.get("/", (req, res) => res.send("Hello World"));

server.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}...`)
);