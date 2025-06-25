// ===== upload.js =====
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // ✅ ADDED addDoc, collection
import { app } from "./firebase-init.js";

const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("upload-form");
const statusText = document.getElementById("status-text");
const previewPlayer = document.getElementById("preview-audio");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const artist = document.getElementById("artist").value.trim();
  const audio = document.getElementById("audio").files[0];
  const cover = document.getElementById("cover").files[0];

  if (!title || !artist || !audio || !cover) {
    statusText.textContent = "❌ All fields are required.";
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    statusText.textContent = "❌ Please sign in to upload a song.";
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("artist", artist);
  formData.append("audio", audio);
  formData.append("cover", cover);
  formData.append("uid", user.uid); // ✅ Save uploader UID

  try {
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.song) {
      statusText.textContent = "🎉 Upload successful!";
      previewPlayer.style.display = "block";
      previewPlayer.src = data.song.url;

      // ✅ Save song to Firestore
      await addDoc(collection(db, "songs"), {
        title: data.song.title,
        artist: data.song.artist,
        url: data.song.url,
        cover: data.song.cover || "",
        uid: user.uid,
        storagePath: data.song.storagePath || ""
      });

      // ✅ Redirect to My Songs page (user's profile)
      setTimeout(() => {
        window.location.href = `profile.html?uid=${user.uid}`;
      }, 1500);
    } else {
      statusText.textContent = "⚠️ Upload failed: " + (data?.error || "Unknown error.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    statusText.textContent = "❌ Server error.";
  }
});
