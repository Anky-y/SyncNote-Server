const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

// Register User
router.post("/create", async (req, res) => {
  console.log(req.body);
  try {
    const { id, userId, title, content, updatedAt, synced, bgColor } = req.body;
    const newNote = new Note({
      _id: id,
      userId,
      title,
      content,
      updatedAt,
      synced,
      bgColor,
    });
    await newNote.save();
    res.status(201).json({ message: "Note created", note: newNote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get notes for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ userId });
    if (notes.length === 0) {
      return res.status(404).json({ message: "No notes found for this user" });
    }
    res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific note by ID
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note
router.put("/:id", async (req, res) => {
  try {
    const updatedFields = req.body;
    // Check if the note exists
    const existingNote = await Note.findById(req.params.id);
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    const updatedNoteData = {
      ...existingNote.toObject(), // Convert Mongoose model to plain object
      ...updatedFields,
      synced: 1, // Ensure the note is marked as synced
    };

    // Update only the fields that were sent in the request
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      updatedNoteData, // Only update provided fields
      { new: true } // Return the updated note
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note updated", note: updatedNote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// API route to save notes to MongoDB
router.post("/sync", async (req, res) => {
  console.log("in sync");
  try {
    const { id, userId, title, content, bgColor, updatedAt } = req.body;

    const newNote = new Note({
      _id: id,
      userId,
      title,
      content,
      updatedAt,
      bgColor,
      synced: 1,
    });
    await newNote.save();

    res.status(200).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving note to database.");
  }
});

module.exports = router;
