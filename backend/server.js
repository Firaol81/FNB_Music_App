// ===== server.js =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const Song = require('./models/Song');

const app = express();
const PORT = 5000;

// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Upload route
app.post('/upload', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist } = req.body;
    const audioFile = req.files.audio?.[0];
    const coverFile = req.files.cover?.[0];

    if (!title || !artist || !audioFile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newSong = new Song({
      title,
      artist,
      url: `http://localhost:5000/uploads/${audioFile.filename}`,
      cover: coverFile ? `http://localhost:5000/uploads/${coverFile.filename}` : null
    });

    await newSong.save();

    res.status(201).json({
      message: 'Upload successful',
      song: newSong
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ✅ Get all songs
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

app.get('/', (req, res) => {
  res.send('FNB Music App Backend is running...');
});

// ✅ Connect to MongoDB
const uri = 'mongodb+srv://firaolbaneta99:Fb3464711@fnbmusiccluster.mg5hmou.mongodb.net/fnbmusicdb?retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
