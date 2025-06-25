// ===== upload.js =====
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { app } from "./firebase-init.js"; // Make sure this path is correct

const auth = getAuth(app);

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
  formData.append("uid", user.uid); // ✅ Associate song with user

  try {
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      statusText.textContent = "🎉 Upload successful!";
      previewPlayer.style.display = "block";
      previewPlayer.src = data.song.url;

      // Optional redirect
      setTimeout(() => {
        const query = new URLSearchParams({
          title: data.song.title,
          artist: data.song.artist,
          url: data.song.url,
          cover: data.song.cover || ""
        }).toString();
        window.location.href = `music.html?${query}`;
      }, 1500);
    } else {
      statusText.textContent = "⚠️ Upload failed: " + (data?.error || "Unknown error.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    statusText.textContent = "❌ Server error.";
  }
});
