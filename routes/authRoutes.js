const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: "Username already taken" });

    const user = new User({ username, password, sync: true });
    await user.save();
    res.status(201).json({
      message: "User registered",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.json({
      message: "Logged in",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify", (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      res.json({ message: "Token is valid", userId: decoded.id });
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout User
router.post("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "Logged out" });
});

module.exports = router;
