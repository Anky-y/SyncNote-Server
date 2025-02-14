const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, unique: true },
  content: { type: String },
  updatedAt: { type: Date },
  bgColor: { type: String },
  synced: { type: Number },
});

module.exports = mongoose.model("Note", NoteSchema);
