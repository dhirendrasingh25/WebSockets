// Modules Imports
import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

// env Constants
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
const secretKey = "knfoiwenfponmpvfomwrv";

// App Configs
const app = express();
const server = new createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH"],
  },
});

// Using Middlewares Here
app.use(express.json());
app.use(cors());
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(new Error("Authentication Error"));
    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication Error"));
    const decoded = jwt.verify(token, secretKey);
    if (!decoded) return next(new Error("Authentication Error"));
    // console.log("Here");
    next();
  });
});

// Socket Connection
io.on("connection", (socket) => {
  console.log("User Connected ID : ", socket.id);

  socket.on("message", (data) => {
    if (!data.room)
      return socket.broadcast.emit("recieve-message", data.message);
    // socket.broadcast.emit("recieved-message", data) sends to all except sender;
    io.to(data.room).emit("recieve-message", data.message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected : ", socket.id);
  });

  socket.on("join-room", (data) => {
    // console.log(data.roomName);
    socket.join(data.roomName);
    console.log("Room Joined : ", data.roomName);
  });
});

// Using Routes

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "123456" }, secretKey);
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .send("Successfully Logged In");
});

// Server   use app for http and server for socket
server.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
