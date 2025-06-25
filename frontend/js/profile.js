import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { app } from "./auth/firebaseConfig.js";

const db = getFirestore(app);
const auth = getAuth(app);

const uid = new URLSearchParams(window.location.search).get("uid");
const profileName = document.getElementById("profile-name");
const profilePhoto = document.getElementById("profile-photo");
const songList = document.getElementById("user-songs");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (uid) {
    await loadUserProfile(uid);
  } else if (user) {
    await loadUserProfile(user.uid); // fallback to current user if no uid param
  } else {
    alert("Please sign in to view profile.");
  }
});

async function loadUserProfile(profileUid) {
  const userDoc = await getDoc(doc(db, "users", profileUid));
  if (!userDoc.exists()) return alert("User not found");

  const user = userDoc.data();
  profileName.textContent = user.name || "No Name";
  profilePhoto.src = user.photo || "assets/images/default-avatar.png";

  const q = query(collection(db, "songs"), where("uid", "==", profileUid));
  const querySnapshot = await getDocs(q);
  songList.innerHTML = "";

  querySnapshot.forEach(docSnap => {
    const song = docSnap.data();
    const id = docSnap.id;

    const li = document.createElement("li");

    li.innerHTML = `
      <img src="${song.cover || 'assets/images/default.jpg'}" alt="cover">
      <div>
        <strong>${song.title}</strong> <br>
        <em style="color:#aaa;">by ${song.artist}</em>
      </div>
      ${currentUser && currentUser.uid === profileUid
        ? `
          <button class="edit-btn" style="margin-left:auto; margin-right:10px;">✏️</button>
          <button class="delete-btn">🗑️</button>
        `
        : ''}
    `;

    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";

    // ✅ Click to play song
    li.addEventListener("click", () => {
      const params = new URLSearchParams({
        title: song.title,
        artist: song.artist,
        url: song.url,
        cover: song.cover
      }).toString();
      window.location.href = `index.html?${params}`;
    });

    // ✅ Delete Button
    li.querySelector(".delete-btn")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (confirm("Are you sure you want to delete this song?")) {
        await deleteDoc(doc(db, "songs", id));
        alert("Song deleted");
        loadUserProfile(profileUid);
      }
    });

    // ✅ Edit Button
    li.querySelector(".edit-btn")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const newTitle = prompt("New Title", song.title);
      const newArtist = prompt("New Artist", song.artist);
      if (newTitle && newArtist) {
        await updateDoc(doc(db, "songs", id), {
          title: newTitle,
          artist: newArtist
        });
        alert("Song updated");
        loadUserProfile(profileUid);
      }
    });

    songList.appendChild(li);
  });
}
