const express = require("express");
const multer = require("multer");
const path = require("path");
const Song = require("../models/Song");

const router = express.Router();

// ✅ Setup Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in /uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Upload Route
router.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const { title, artist } = req.body;

    // Build file URLs and storage path
    const filename = req.file.filename;
    const fileUrl = `http://localhost:5000/uploads/${filename}`;
    const storagePath = `uploads/${filename}`; // <-- Important for future delete

    // Save to MongoDB
    const newSong = new Song({
      title,
      artist,
      url: fileUrl,
      cover: "",          // Optional — add cover support later if needed
      storagePath: storagePath,
    });

    await newSong.save();

    // Return song info to frontend
    res.status(201).json({
      message: "Song uploaded successfully",
      song: {
        title,
        artist,
        url: fileUrl,
        cover: "",
        storagePath: storagePath,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
