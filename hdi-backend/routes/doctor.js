const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");
const JobOpening = require("../models/JobOpening");
const Hospital = require("../models/hospital");

const Request = require("../models/requests");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * 1. Doctor Signup (Minimal Info)
 * Required: name, email, phone, password, registrationNumber
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, registrationNumber } = req.body;

    if (!name || !email || !phone || !password || !registrationNumber) {
      return res
        .status(400)
        .json({ status: "error", message: "All required fields must be filled." });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { phone }, { registrationNumber }],
    });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ status: "error", message: "Doctor already exists." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      email,
      phone,
      password: hashedPassword,
      registrationNumber,
    });

    await newDoctor.save();

    res.status(201).json({
      status: "ok",
      message: "Signup successful! Please complete your profile.",
      doctorId: newDoctor._id,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * 2. Update/Complete Doctor Profile
 * Doctor must be logged in (in production, add JWT auth here)
 */
router.put("/updateProfile/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;

    // fields that can be updated
    const updatableFields = {
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      education: req.body.education,
      specialities: req.body.specialities,
      hospitalAffiliations: req.body.hospitalAffiliations,
      experience: req.body.experience,
      yearsOfExperience: req.body.yearsOfExperience,
      expectedSalary: req.body.expectedSalary,
      languages: req.body.languages,
      bio: req.body.bio,
      profileImage: req.body.profileImage,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    };

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { $set: updatableFields },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ status: "error", message: "Doctor not found" });
    }

    res.json({
      status: "ok",
      message: "Profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Email and password are required." });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res
        .status(404)
        .json({ status: "error", message: "Doctor not found." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign({ id: doctor._id, email: doctor.email }, JWT_SECRET, {
      expiresIn: "1h", // token valid for 1 hour
    });

    res.json({
      status: "ok",
      message: "Login successful",
      token,
      doctorId: doctor._id,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET Doctor Info (Protected in real-world apps with JWT)
router.get("/getDoctor/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password"); // don’t return password
    if (!doctor) {
      return res.status(404).json({ status: "error", message: "Doctor not found" });
    }
    res.json({ status: "ok", data: doctor });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// router.get("/jobOpenings", async (req, res) => {
//   try {
//     const today = new Date();

//     // Fetch jobs where deadline not passed and status is Open
//     const jobs = await JobOpening.find({
//       $and: [
//         { status: "Open" },
//         {
//           $or: [
//             { applicationDeadline: { $exists: false } },
//             { applicationDeadline: { $gte: today } }
//           ]
//         }
//       ]
//     }).populate("hospital", "name email phone address"); // fetch hospital details

//     res.json({
//       status: "ok",
//       message: "Job openings fetched successfully",
//       data: jobs,
//     });
//   } catch (err) {
//     console.error("Error fetching job openings:", err);
//     res.status(500).json({ status: "error", message: err.message });
//   }
// });

router.get("/jobOpenings/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date();

    // Fetch open jobs
    const jobs = await JobOpening.find({
      status: "Open",
      applicationDeadline: { $gte: today }
    }).populate("hospital", "name email phone");

    // Fetch doctor applications
    const appliedRequests = await Request.find({
      "sender.id": doctorId,
      "sender.type": "Doctor",
      jobOpening: { $ne: null }
    }).select("jobOpening");

    const appliedIds = appliedRequests.map((r) => r.jobOpening.toString());

    // Add "applied: true/false" to each job
    const jobsWithApplied = jobs.map((job) => ({
      ...job.toObject(),
      applied: appliedIds.includes(job._id.toString())
    }));

    res.json({
      status: "ok",
      data: jobsWithApplied,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


router.post("/applyJob", async (req, res) => {
  try {
    const { doctorId, hospitalId, jobOpeningId, role, salary, location } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ status: "error", message: "Doctor not found" });

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return res.status(404).json({ status: "error", message: "Hospital not found" });

    const newRequest = new Request({
      sender: { id: doctor._id, type: "Doctor" },
      receiver: { id: hospital._id, type: "Hospital" },
      jobOpening: jobOpeningId,
      role,
      location,
      salary: salary,
      status: "Pending",
      dateOfAppeal: new Date(),
      expireDate: null,
    });

    await newRequest.save();

    res.json({
      status: "ok",
      message: "Application submitted successfully",
      data: newRequest,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.get("/:doctorId/requests-received", async (req, res) => {
  try {
    const { doctorId } = req.params;

    // check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ status: "error", message: "Doctor not found" });
    }

    // find requests where this doctor is the receiver
    const requests = await Request.find({
      "receiver.id": doctorId,
      "receiver.type": "Doctor",
    })
      .populate("sender.id", "name email") // populate hospital info
      .sort({ createdAt: -1 });

    res.json({
      status: "ok",
      data: requests,
    });
  } catch (err) {
    console.error("Error fetching doctor requests:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Get all requests SENT by a doctor
router.get("/:doctorId/requests-sent", async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ status: "error", message: "Doctor not found" });
    }

    // Find requests where this doctor is the sender
    const requests = await Request.find({
      "sender.id": doctorId,
      "sender.type": "Doctor",
    })
      .populate("receiver.id", "name email") // ✅ populate hospital info
      .sort({ createdAt: -1 });

    res.json({
      status: "ok",
      data: requests,
    });
  } catch (err) {
    console.error("Error fetching doctor sent requests:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});


router.post("/requests/accept", async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ status: "error", message: "Request not found" });
    }

    request.status = "Accepted";
    await request.save();

    res.json({ status: "ok", message: "Request accepted", data: request });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Reject Request
router.post("/requests/reject", async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ status: "error", message: "Request not found" });
    }

    request.status = "Rejected";
    await request.save();

    res.json({ status: "ok", message: "Request rejected", data: request });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// doctorRoutes.js
router.get("/:doctorId/active-collaborations", async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ status: "error", message: "Doctor not found" });
    }

    const activeRequests = await Request.find({
      $or: [
        { "sender.id": doctorId, "sender.type": "Doctor" },
        { "receiver.id": doctorId, "receiver.type": "Doctor" }
      ],
      status: "Accepted"
    })
      .populate("sender.id", "name email phone")
      .populate("receiver.id", "name email phone")
      .sort({ updatedAt: -1 });

    res.json({ status: "ok", data: activeRequests });
  } catch (err) {
    console.error("Error fetching active collaborations:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});



module.exports = router;
