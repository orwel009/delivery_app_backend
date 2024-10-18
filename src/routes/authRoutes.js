import express from "express";
import bcrypt from "bcryptjs";
import Host from "../models/Host.js"; // Adjust the path to your model
import DP from "../models/DP.js"; // DP Model

const router = express.Router();

// Host Registration Route
router.post("/register", async (req, res) => {
  try {
    const newHost = new Host(req.body);
    await newHost.save();
    res
      .status(201)
      .json({ message: "Host registered successfully", host: newHost });
  } catch (error) {
    res.status(500).json({ message: "Error registering host", error });
  }
});

// Host Login Route
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const host = await Host.findOne({ name });
    if (!host) {
      return res.status(401).json({ message: "Invalid name or password" });
    }

    const isMatch = await bcrypt.compare(password, host.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid name or password" });
    }

    // Store user information in session (assuming sessions are set up)
    req.session.hostId = host._id;
    req.session.save();

    res.status(200).json({ message: "Login successful", host });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
    console.error(err);
  }
});

// DP Registration Route
router.post("/dpregister", async (req, res) => {
  // Get the hostId from session
  const hostId = req.session.hostId; // Ensure you have session management set up
  if (!hostId) {
    return res.status(401).json({ message: "Host not logged in" });
  }

  try {
    // Ensure Host exists
    const host = await Host.findById(hostId);
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    // Create DP registration details
    const dpData = new DP({
      DLNumber: req.body.DLNumber, // DLNumber sent in the request body
      RCNumber: req.body.RCNumber, // RCNumber sent in the request body
      hostId: hostId, // Associate DP with the Host
    });

    // Save DP registration
    await dpData.save();
    res.status(201).json({ message: "DP Registration successful", dpData });
  } catch (error) {
    console.error("Error registering DP:", error);
    res
      .status(500)
      .json({ message: "Error registering DP", error: error.message });
  }
});

export default router;
