https://www.facebook.com/QOOSAAFAANOROMOOconst mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();     // Create express app FIRST

app.use(cors());           // Then use cors middleware

const PORT = 5000;

// ... rest of your code


// MongoDB Connection URI (replace with your password)
const uri = 'mongodb+srv://firaolbaneta99:Fb3464711@fnbmusiccluster.mg5hmou.mongodb.net/fnbmusicdb?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON body
app.use(express.json());

// Define Song Schema and Model
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  url: { type: String, required: true }
});

const Song = mongoose.model('Song', songSchema);

// Test route for GET /
app.get('/', (req, res) => {
  res.send('FNB Music App Backend is running...');
});

// Get all songs
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Add a new song (POST /songs)
app.post('/songs', async (req, res) => {
  try {
    const { title, artist, url } = req.body;

    // Validate required fields
    if (!title || !artist || !url) {
      return res.status(400).json({ error: 'Please provide title, artist, and url' });
    }

    const newSong = new Song({ title, artist, url });
    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (err) {
    console.error('Error saving song:', err);
    res.status(500).json({ error: 'Failed to save song' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
