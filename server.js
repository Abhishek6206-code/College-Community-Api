import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRouter from "./Routes/auth.js";
import clubRouter from "./Routes/club.js";
import eventRouter from "./Routes/event.js";
import resourceRouter from "./Routes/resource.js";
import groupRouter from "./Routes/group.js";
import { Message } from "./Models/Message.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB })
  .then(() => console.log("MongoDB connected"))
  .catch((err) =>
    console.error("MongoDB connection error:", err)
  );

app.use("/api/auth", authRouter);
app.use("/api/clubs", clubRouter);
app.use("/api/events", eventRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/groups", groupRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinGroupChat", (groupId) => {
    socket.join(groupId);
    console.log(`Socket ${socket.id} joined chat for group ${groupId}`);
  });

  socket.on("sendMessage", async ({ groupId, senderId, content }) => {
    try {
      const newMsg = await Message.create({
        groupId,
        sender: senderId,
        content,
      });
      const populatedMsg = await newMsg.populate("sender", "name email");
      io.to(groupId).emit("newMessage", populatedMsg);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
