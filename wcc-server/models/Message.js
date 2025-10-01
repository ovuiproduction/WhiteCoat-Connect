const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    sender: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      type: { type: String, enum: ["Doctor", "Hospital"], required: true }
    },
    text: {
      type: String,
    },
    fileUrl: {
      type: String, // if image/doc shared
    },
    seen: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
