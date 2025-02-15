const express = require("express");
const User = require("../models/User");
const router = express.Router();

//Update User
router.put("/update", async (req, res) => {
  console.log(req.body);
  try {
    const { newUsername, userId } = req.body;
    // const { userId } = req.user; // Assuming the user is authenticated and userId is available in req.user
    if (!userId || !newUsername) {
      return res.status(400).json({ message: "Missing userId or newUsername" });
    }
    // Find the user and update the username
    const user = await User.findOneAndUpdate(
      { _id: userId }, //  Correct filter syntax
      { username: newUsername },
      { new: true } //  Return the updated user
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // // Update password if provided
    // if (newPassword) {
    //   const salt = await bcrypt.genSalt(10);
    //   user.password = await bcrypt.hash(newPassword, salt);
    // }

    // Save the updated user
    res.json({ message: "User updated", user });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Update Sync Status
router.put("/sync-status", async (req, res) => {
  console.log(req.body);
  try {
    const { sync, userId } = req.body;

    if (typeof sync !== "boolean" || !userId) {
      return res.status(400).json({ message: "Missing or invalid sync status or userId" });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { sync },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Sync status updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;


