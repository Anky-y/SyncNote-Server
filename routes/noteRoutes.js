const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

// Register User
router.post("/create", async (req, res) => {
  console.log(req.body);
  try {
    const { title, content, updatedAt, synced } = req.body;
    const newNote = new Note({ title, content, updatedAt, synced });
    await newNote.save();
    res.status(201).json({ message: "Note created", note: newNote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
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
    const { title, content, updatedAt, synced } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt, synced },
      { new: true } // Return the updated note
    );
    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });
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
  try {
    const { id, title, content, updatedAt } = req.body;

    const newNote = new Note({ id, title, content, updatedAt, synced: 1 });
    await newNote.save();

    res.status(200).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving note to database.");
  }
});

module.exports = router;
