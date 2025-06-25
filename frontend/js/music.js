import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB6AKaS6k9__rklMiP9iVNjHEcKr8jLA3w",
  authDomain: "fnb-studio-application.firebaseapp.com",
  projectId: "fnb-studio-application",
  storageBucket: "fnb-studio-application.appspot.com",
  messagingSenderId: "385097682668",
  appId: "1:385097682668:web:1c5069d9e37e689beb9fc9",
  measurementId: "G-ZQTWE441M9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const songList = document.getElementById("song-list");

onAuthStateChanged(auth, async (user) => {
  const snapshot = await getDocs(collection(db, "songs"));
  songList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const song = docSnap.data();
    const songId = docSnap.id;

    const div = document.createElement("div");
    div.className = "song-card";
    div.innerHTML = `
      <img src="${song.cover || 'assets/images/default.jpg'}" alt="cover">
      <div class="song-info">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <audio controls src="${song.url}" style="width:100%; margin-top:10px;"></audio>
        <div style="margin-top: 10px;">
          <button onclick="window.location.href='profile.html?uid=${song.uid}'">👤 View Artist</button>
          ${user && user.uid === song.uid
            ? `<button class="delete-btn" data-id="${songId}">🗑️ Delete</button>`
            : ""}
        </div>
      </div>
    `;

    songList.appendChild(div);
  });

  // ✅ Delete Handler
  songList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this song?")) {
        await deleteDoc(doc(db, "songs", id));
        alert("Deleted");
        location.reload();
      }
    }
  });
});
