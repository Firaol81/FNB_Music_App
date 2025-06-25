# 🎧 FNB Music App

![Live Demo](https://img.shields.io/badge/Live%20Demo-Coming%20Soon-blue)
![Built with](https://img.shields.io/badge/Built%20with-Node.js%2C%20Firebase%2C%20MongoDB-green)
![Author](https://img.shields.io/badge/Built%20by-Firaol%20Nebi%20Baneta-red)




## ⚙️ Getting Started: Run Backend First (MongoDB + Node.js)

Before using the frontend, you must start the backend server to connect to MongoDB and handle music uploads and playback.

---

### 🔌 Step 1: Start the Backend Server

1. Make sure you have **Node.js** and **MongoDB URI** (from MongoDB Atlas or local)
2. Open the project folder in **Visual Studio Code**
3. Open the terminal (**Terminal → New Terminal**)
4. Create a `.env` file at the root of the project and add your MongoDB connection string:

The server should say something like:
✅ Server running at http://localhost:5000
✅ Connected to MongoDB




🧠 What the Backend Does
Connects to MongoDB using Mongoose

Handles song uploads and stores them in a local folder or database

Provides API endpoints like:

GET /songs → Get all songs

POST /upload → Upload a song (with cover, title, artist, and user info)

✅ Next Step: Open the Frontend
After starting the backend, open index.html or any other frontend page in your browser to:

Sign in with Firebase

Upload songs

Play music

View your profile and song list

Let me know if you want me to include a sample `.env` file, or show the actual `node.server.js` content with MongoDB connected.


