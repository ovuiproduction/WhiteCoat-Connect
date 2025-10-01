const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    sender: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "sender.type" },
      type: { type: String, enum: ["Doctor", "Hospital"], required: true }
    },
    receiver: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true,refPath: "receiver.type" },
      type: { type: String, enum: ["Doctor", "Hospital"], required: true }
    },
    jobOpening: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobOpening", // optional: link to a job opening if exists
      default: null
    },
    dateOfAppeal: {
      type: Date,
      default: Date.now
    },
    expireDate: {
      type: Date
    },
    location: {
      type: String
    },
    role: {
      type: String, // e.g. "Cardiologist", "Surgeon"
    },
    message: {
      type: String // optional message/cover letter
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Withdrawn"],
      default: "Pending"
    },
    salary: {
      min: { type: Number },
      max: { type: Number }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
