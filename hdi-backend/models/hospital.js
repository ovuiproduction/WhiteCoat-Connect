const mongoose = require("mongoose");

const HospitalInfo = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters"],
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["Private", "Government", "Clinic", "Multispeciality", "Other"],
      default: "Private",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    bedCapacity: {
      type: Number,
      default: 0,
    },
    departments: {
      type: [String], // ["Cardiology", "Neurology", "Orthopedics"]
      default: [],
    },
    servicesArray: {
      type: [String], // ["OPD", "Emergency", "Diagnostics"]
      default: [],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", HospitalInfo);
