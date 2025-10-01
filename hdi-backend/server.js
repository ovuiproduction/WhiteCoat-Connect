// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");

// const Conversation = require("./models/Conversation");
// const Message = require("./models/Message");

// const doctorRoutes = require("./routes/doctor");
// const hospitalRoutes = require("./routes/hospital");
// const chatRoutes = require("./routes/chat");

// try {
//   mongoose.connect("mongodb://localhost:27017/hd_db");
// } catch (err) {
//   console.log("error : " + err);
// }

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.use("/doctor", doctorRoutes);
// app.use("/hospital", hospitalRoutes);
// app.use("/chat", chatRoutes);


// let onlineUsers = new Map();

// io.on("connection", (socket) => {
//   console.log("⚡ New connection", socket.id);

//   // register user
//   socket.on("register", ({ userId, userType }) => {
//     onlineUsers.set(userId, socket.id);
//     console.log(`✅ ${userType} ${userId} connected`);
//   });

//   // handle sending messages
//   socket.on("sendMessage", async ({ conversationId, senderId, senderType, text }) => {
//     try {
//       const newMessage = new Message({
//         conversationId,
//         sender: { id: senderId, type: senderType },
//         text
//       });
//       await newMessage.save();

//       await Conversation.findByIdAndUpdate(conversationId, {
//         lastMessage: text,
//         updatedAt: new Date()
//       });

//       // find conversation participants
//       const conversation = await Conversation.findById(conversationId);

//       // send to all participants
//       conversation.participants.forEach((p) => {
//         const targetSocketId = onlineUsers.get(p.id.toString());
//         if (targetSocketId && p.id.toString() !== senderId) {
//           io.to(targetSocketId).emit("receiveMessage", newMessage);
//         }
//       });

//       // also send back to sender
//       socket.emit("messageSent", newMessage);
//     } catch (err) {
//       console.error("Error saving message:", err);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected", socket.id);
//     [...onlineUsers.entries()].forEach(([userId, sockId]) => {
//       if (sockId === socket.id) onlineUsers.delete(userId);
//     });
//   });
// });

// app.get("/", async (req, res) => {
//   try {
//     res.send("HDI Server Running");
//   } catch (err) {
//     console.log(err);
//     res.redirect("/");
//   }
// });

// app.listen(5000, (req, res) => {
//   console.log(`server live on port 5000`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

const doctorRoutes = require("./routes/doctor");
const hospitalRoutes = require("./routes/hospital");
const chatRoutes = require("./routes/chat");

// ✅ MongoDB connection
try {
  mongoose.connect("mongodb://localhost:27017/hd_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB connected");
} catch (err) {
  console.log("❌ MongoDB error : " + err);
}

const app = express();
app.use(express.json());
app.use(cors());

// ✅ REST routes
app.use("/doctor", doctorRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/chat", chatRoutes);

// ✅ Create HTTP server & wrap app
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // your frontend port
    methods: ["GET", "POST"],
  },
});

// ✅ Store online users
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ New connection", socket.id);

  // register user
  socket.on("register", ({ userId, userType }) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ ${userType} ${userId} connected`);
  });

  // handle sending messages
  socket.on("sendMessage", async ({ conversationId, senderId, senderType, text }) => {
    try {
      const newMessage = new Message({
        conversationId,
        sender: { id: senderId, type: senderType },
        text,
      });
      await newMessage.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
        updatedAt: new Date(),
      });

      // find conversation participants
      const conversation = await Conversation.findById(conversationId);

      // send to all participants
      conversation.participants.forEach((p) => {
        const targetSocketId = onlineUsers.get(p.id.toString());
        if (targetSocketId && p.id.toString() !== senderId) {
          io.to(targetSocketId).emit("receiveMessage", newMessage);
        }
      });

      // also send back to sender
      socket.emit("messageSent", newMessage);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected", socket.id);
    [...onlineUsers.entries()].forEach(([userId, sockId]) => {
      if (sockId === socket.id) onlineUsers.delete(userId);
    });
  });
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("HDI Server Running");
});

// ✅ Use server.listen instead of app.listen
server.listen(5000, () => {
  console.log(`🚀 Server live on port 5000`);
});
