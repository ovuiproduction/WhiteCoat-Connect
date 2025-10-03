const express = require("express");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Doctor = require("../models/doctor");
const Hospital = require("../models/hospital");
const router = express.Router();

router.get("/get-all-contact", async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "name email phone").lean();
    const hospitals = await Hospital.find({}, "name email phone").lean();

    // Tag each with type
    const contacts = [
      ...doctors.map((d) => ({ ...d, type: "Doctor" })),
      ...hospitals.map((h) => ({ ...h, type: "Hospital" })),
    ];

    res.json({ status: "ok", data: contacts });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});
// Start or get a conversation
router.post("/start", async (req, res) => {
  try {
    const { senderId, senderType, receiverId, receiverType } = req.body;

    let conversation = await Conversation.findOne({
      "participants.id": { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [
          { id: senderId, type: senderType },
          { id: receiverId, type: receiverType }
        ]
      });
      await conversation.save();
    }

    res.json({ status: "ok", conversation });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Send a message
router.post("/send", async (req, res) => {
  try {
    const { conversationId, senderId, senderType, text } = req.body;

    const newMessage = new Message({
      conversationId,
      sender: { id: senderId, type: senderType },
      text
    });
    await newMessage.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      updatedAt: new Date()
    });

    res.json({ status: "ok", message: newMessage });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Fetch messages of a conversation
router.get("/:conversationId/messages", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json({ status: "ok", data: messages });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Fetch conversations for a user (Doctor/Hospital)
router.get("/:userId/:userType/conversations", async (req, res) => {
  try {
    const { userId, userType } = req.params;
    const conversations = await Conversation.find({
      participants: { $elemMatch: { id: userId, type: userType } }
    }).populate("participants.id", "name email")
    .populate("lastMessage", "text createdAt fileUrl sender");

    res.json({ status: "ok", data: conversations });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.post("/startConversation", async (req, res) => {
  try {
    const { participants } = req.body; 
    // participants = [{id, type}, {id, type}]

    if (!participants || participants.length !== 2) {
      return res.status(400).json({ status: "error", message: "Two participants required" });
    }

    // Check if conversation already exists
    let existing = await Conversation.findOne({
      participants: {
        $all: participants.map((p) => ({
          $elemMatch: { id: p.id, type: p.type }
        }))
      }
    }).populate("participants.id", "name email");

    if (existing) {
      return res.json({ status: "ok", data: existing });
    }

    // Create new conversation
    const newConversation = new Conversation({ participants });
    await newConversation.save();
    const populatedConv = await newConversation.populate("participants.id", "name email");

    res.json({ status: "ok", data: populatedConv });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});




module.exports = router;
