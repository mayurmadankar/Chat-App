import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

const app = express();

//1.create server using http
const server = http.createServer(app);

//2.Create the socket server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//3. Use socket events
io.on("connection", (socket) => {
  console.log("Connection is established");
  socket.on("new_message", (message) => {
    socket.broadcast.emit("broadcast_message", message);
  });
  socket.on("disconnect", () => {
    console.log("Connection is Disconnect");
  });
});

server.listen(2000, () => {
  console.log("App is Listening on 2000");
});
