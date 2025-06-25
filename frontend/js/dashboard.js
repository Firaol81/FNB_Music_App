// dashboard.js

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { app } from "./auth/firebaseConfig.js";

const db = getFirestore(app);
const auth = getAuth(app);

const userList = document.getElementById("song-list");
const searchInput = document.getElementById("user-search");
const followersEl = document.getElementById("follower-count");
const followingEl = document.getElementById("following-count");

let currentUID = null;

function renderUserCard(user, isFollowing) {
  const li = document.createElement("li");
  li.className = "user-card";
  li.style.display = "flex";
  li.style.alignItems = "center";
  li.style.marginBottom = "15px";

  li.innerHTML = `
    <img src="${user.photo || 'assets/images/default-avatar.png'}" style="width:60px; height:60px; border-radius:50%;">
    <span style="margin-left:15px; font-size:20px;">${user.name}</span>
    <button class="follow-btn" style="
      margin-left:auto;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 20px;
      color: white;
      background-color: ${isFollowing ? '#333' : '#1da1f2'};
      border: none;
      cursor: pointer;
    ">${isFollowing ? "Following" : "Follow"}</button>
  `;

  const followBtn = li.querySelector(".follow-btn");

  followBtn.addEventListener("click", async (e) => {
    e.stopPropagation(); // prevent redirect

    if (!currentUID || !user.uid) {
      console.error("Missing UID! currentUID:", currentUID, "targetUID:", user.uid);
      alert("Error: Unable to follow. Missing user ID.");
      return;
    }

    try {
      if (isFollowing) {
        await updateDoc(doc(db, "users", currentUID), {
          following: arrayRemove(user.uid)
        });
        await updateDoc(doc(db, "users", user.uid), {
          followers: arrayRemove(currentUID)
        });
        followBtn.textContent = "Follow";
        followBtn.style.backgroundColor = "#1da1f2";
      } else {
        await updateDoc(doc(db, "users", currentUID), {
          following: arrayUnion(user.uid)
        });
        await updateDoc(doc(db, "users", user.uid), {
          followers: arrayUnion(currentUID)
        });
        followBtn.textContent = "Following";
        followBtn.style.backgroundColor = "#333";
      }
    } catch (err) {
      console.error("Follow/Unfollow error:", err);
      alert("Something went wrong. Try again.");
    }
  });

  li.addEventListener("click", () => {
    window.location.href = `profile.html?uid=${user.uid}`;
  });

  return li;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  currentUID = user.uid;

  // Ensure Firestore has current user document
  const userRef = doc(db, "users", currentUID);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: currentUID,
      name: user.displayName || "Anonymous",
      email: user.email || "",
      photo: user.photoURL || "",
      followers: [],
      following: [],
      uploads: []
    });
  }

  const currentData = (await getDoc(userRef)).data();
  followersEl.textContent = currentData.followers?.length || 0;
  followingEl.textContent = currentData.following?.length || 0;

  const allUsers = await getDocs(collection(db, "users"));
  const userCards = [];

  allUsers.forEach(docSnap => {
    const u = docSnap.data();
    if (u.uid && u.uid !== currentUID) {
      const isFollowing = currentData.following?.includes(u.uid);
      userCards.push(renderUserCard(u, isFollowing));
    }
  });

  const renderList = (filter = "") => {
    userList.innerHTML = "";
    userCards.forEach(card => {
      const name = card.querySelector("span").textContent.toLowerCase();
      if (name.includes(filter.toLowerCase())) {
        userList.appendChild(card);
      }
    });
  };

  renderList();

  searchInput.addEventListener("input", () => {
    renderList(searchInput.value);
  });

  // ✅ Followers/Following Click Events
  followersEl.parentElement.addEventListener("click", () => {
    alert(`Followers:\n${(currentData.followers || []).join("\n") || "No followers"}`);
  });

  followingEl.parentElement.addEventListener("click", () => {
    alert(`Following:\n${(currentData.following || []).join("\n") || "No following"}`);
  });
});
