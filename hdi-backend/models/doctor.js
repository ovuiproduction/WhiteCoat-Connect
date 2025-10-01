const mongoose = require("mongoose");

const DL_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters"]
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },
    dateOfBirth: {
      type: Date
    },
    education: {
      type: [String], // ["MBBS", "MD - Cardiology"]
      default: []
    },
    specialities: {
      type: [String], // ["Cardiology", "Orthopedics"]
      default: []
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true // Medical Council Registration
    },
    hospitalAffiliations: {
      type: [String], // ["Apollo Hospital", "AIIMS Delhi"]
      default: []
    },
    experience: {
      type: [
        {
          hospital: String,
          role: String,
          years: Number
        }
      ],
      default: []
    },
    yearsOfExperience: {
      type: Number,
      default: 0
    },
    expectedSalary: {
      type: Number
    },
    languages: {
      type: [String], // ["English", "Hindi", "Marathi"]
      default: []
    },
    bio: {
      type: String
    },
    profileImage: {
      type: String
    },
    city: String,
    state: String,
    country: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DL_Schema);
