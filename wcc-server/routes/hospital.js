const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");
const JobOpening = require("../models/JobOpening");

const Request = require("../models/requests");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "hospitalSecretKey";

/**
 * 1. Minimal Signup
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, registrationNumber } = req.body;

    if (!name || !email || !phone || !password || !registrationNumber) {
      return res.status(400).json({ status: "error", message: "All fields required" });
    }

    const existing = await Hospital.findOne({ $or: [{ email }, { phone }, { registrationNumber }] });
    if (existing) {
      return res.status(400).json({ status: "error", message: "Hospital already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hospital = new Hospital({
      name,
      email,
      phone,
      password: hashedPassword,
      registrationNumber
    });
    await hospital.save();

    res.status(201).json({ status: "ok", message: "Signup successful", hospitalId: hospital._id });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * 2. Update Profile
 */
router.put("/updateProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Only allow specific fields to be updated
    const allowedFields = [
      "type",
      "address",
      "bedCapacity",
      "departments",
      "servicesArray",
    ];
    const filteredUpdate = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredUpdate[field] = updateData[field];
      }
    });

    const updatedHospital = await Hospital.findByIdAndUpdate(
      id,
      { $set: filteredUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedHospital) {
      return res
        .status(404)
        .json({ status: "error", message: "Hospital not found" });
    }

    res.json({
      status: "ok",
      message: "Hospital profile updated successfully",
      data: updatedHospital,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Email and password required" });
    }

    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res
        .status(404)
        .json({ status: "error", message: "Hospital not found" });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: hospital._id, email: hospital.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: "ok",
      message: "Login successful",
      token,
      hospitalId: hospital._id,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET /hospital/details/:email
router.get("/details/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const hospital = await Hospital.findOne({ email });

    if (!hospital) {
      return res.status(404).json({ status: "error", message: "Hospital not found" });
    }

    res.json({ status: "ok", data: hospital });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


router.post("/:id/addOpening", async (req, res) => {
  try {
    const { id } = req.params; // hospitalId
    const jobData = req.body;

    // Verify hospital exists
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ status: "error", message: "Hospital not found" });
    }

    // Create job opening linked to this hospital
    const newJob = new JobOpening({
      ...jobData,
      hospital: hospital._id, // link job to hospital
    });

    await newJob.save();

    res.json({
      status: "ok",
      message: "Job opening added successfully",
      data: newJob,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.get("/:hospitalId/jobOpenings", async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Ensure hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital not found"
      });
    }

    // Find all job openings by hospital
    const jobs = await JobOpening.find({ hospital: hospitalId });

    res.json({
      status: "ok",
      message: "Job openings fetched successfully",
      data: jobs
    });
  } catch (err) {
    console.error("Error fetching hospital job openings:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.get("/getDoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password"); // exclude password
    res.json({ status: "ok", data: doctors });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// routes/hospital.js (example)
router.post("/sendRequest", async (req, res) => {
  try {
    const { hospitalId, doctorId, salaryMin, salaryMax, location, expireDate, role, message } = req.body;

    // Validate hospital & doctor existence
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ status: "error", message: "Hospital not found" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ status: "error", message: "Doctor not found" });
    }

    // Create new request
    const newRequest = new Request({
      sender: { id: hospital._id, type: "Hospital" },
      receiver: { id: doctor._id, type: "Doctor" },
      salary: {
        min: salaryMin ? Number(salaryMin) : undefined,
        max: salaryMax ? Number(salaryMax) : undefined,
      },
      location,
      role,
      message,
      dateOfAppeal: new Date(),
      expireDate: expireDate ? new Date(expireDate) : null,
      status: "Pending",
    });

    await newRequest.save();

    res.json({
      status: "ok",
      message: "Request sent successfully",
      data: newRequest,
    });
  } catch (err) {
    console.error("Error in /sendRequest:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.get("/history/:hospitalId", async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const requests = await Request.find({ "sender.id": hospitalId, "sender.type": "Hospital" })
      .populate("receiver.id", "name specialities education email") // fetch doctor details
      .sort({ createdAt: -1 });

    res.json({ status: "ok", data: requests });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


// ✅ Get all requests SENT by hospital
router.get("/:hospitalId/requests-sent", async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const requests = await Request.find({
      "sender.id": hospitalId,
      "sender.type": "Hospital"
    })
      .populate("receiver.id", "name email specialities")
      .sort({ createdAt: -1 });

    res.json({ status: "ok", data: requests });
  } catch (err) {
    console.error("Error fetching sent requests:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ Get all requests RECEIVED by hospital
router.get("/:hospitalId/requests-received", async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const requests = await Request.find({
      "receiver.id": hospitalId,
      "receiver.type": "Hospital"
    })
      .populate("sender.id", "name email education specialities")
      .sort({ createdAt: -1 });

    res.json({ status: "ok", data: requests });
  } catch (err) {
    console.error("Error fetching received requests:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});


// ✅ Accept a doctor request
router.post("/requests/:requestId/accept", async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ status: "error", message: "Request not found" });
    }

    // Update status
    request.status = "Accepted";
    await request.save();

    res.json({ status: "ok", message: "Request accepted successfully", data: request });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ Reject a doctor request
router.post("/requests/:requestId/reject", async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ status: "error", message: "Request not found" });
    }

    request.status = "Rejected";
    await request.save();

    res.json({ status: "ok", message: "Request rejected successfully", data: request });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


// routes/hospitalRoutes.js

router.get("/:hospitalId/activeRequests", async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Check hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res
        .status(404)
        .json({ status: "error", message: "Hospital not found" });
    }

    // Fetch accepted requests (either hospital sent or received)
    const requests = await Request.find({
      status: "Accepted",
      $or: [
        { "receiver.id": hospitalId, "receiver.type": "Hospital" },
        { "sender.id": hospitalId, "sender.type": "Hospital" }
      ]
    })
      .populate("sender.id", "name email specialities")
      .populate("receiver.id", "name email specialities")
      .sort({ updatedAt: -1 });

    res.json({
      status: "ok",
      data: requests,
    });
  } catch (err) {
    console.error("Error fetching active hospital collaborations:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});


module.exports = router;
