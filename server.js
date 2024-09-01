import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import { connectToMongoDB } from "./config.js";
import { timeStamp } from "console";
import { chatModel } from "./chat.schema.js";

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

  socket.on("join", (data) => {
    socket.username = data;
    //send old messages to the clients.
    chatModel
      .find()
      .sort({ timeStamp: 1 })
      .limit(50)
      .then((messages) => {
        socket.emit("load_messages", messages);
        // console.log(messages);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("new_message", (message) => {
    let userMessage = {
      username: socket.username,
      message: message,
      timestamp: new Date() // Ensuring the timestamp is correctly generated
    };
    const newChat = new chatModel(userMessage);
    newChat
      .save()
      .then(() => {
        // broadcast this message to all the clients
        socket.broadcast.emit("broadcast_message", userMessage);
      })
      .catch((err) => console.error(err));
  });

  socket.on("disconnect", () => {
    console.log("Connection is Disconnect");
  });
});

server.listen(2000, () => {
  console.log("App is Listening on 2000");
  connectToMongoDB();
});
