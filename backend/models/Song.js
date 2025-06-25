// ===== models/Song.js =====
const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  url: { type: String, required: true },
  cover: { type: String }, // Optional: in case you add cover image support later
});

module.exports = mongoose.model('Song', SongSchema);
