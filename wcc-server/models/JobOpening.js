const mongoose = require("mongoose");

const JobOpeningSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    requiredEducation: {
      type: String
    },
    requiredSpecialities: {
      type: [String], // e.g. ["Cardiology", "Neurology"]
      default: []
    },
    experienceRequired: {
      type: String // e.g. "3-5 years"
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number }
    },
    location: {
      type: String
    },
    applicationDeadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Filled"],
      default: "Open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobOpening", JobOpeningSchema);
