const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, enum: ["Doctor", "Hospital"], required: true }
      }
    ],
    lastMessage: {
      type: String,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
