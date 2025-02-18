const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  _id: { type: String, required: true },
  title: { type: String },
  content: { type: String },
  updatedAt: { type: Date },
  bgColor: { type: String },
  synced: { type: Number },
});

module.exports = mongoose.model("Note", NoteSchema);
