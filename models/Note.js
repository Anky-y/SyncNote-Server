const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  content: { type: String },
  updatedAt: { type: Date },
  synced: { type: Boolean },
});

module.exports = mongoose.model("Note", NoteSchema);
