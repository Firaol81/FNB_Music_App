// login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB6AKaS6k9__rklMiP9iVNjHEcKr8jLA3w",
  authDomain: "fnb-studio-application.firebaseapp.com",
  projectId: "fnb-studio-application",
  storageBucket: "fnb-studio-application.appspot.com",
  messagingSenderId: "385097682668",
  appId: "1:385097682668:web:1c5069d9e37e689beb9fc9",
  measurementId: "G-ZQTWE441M9"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ✅ DOM Elements
const loginBtn = document.getElementById("google-login-btn");
const logoutBtn = document.getElementById("logout-btn");
const settingsMenu = document.getElementById("settings-menu");
const settingsBtn = document.getElementById("settings-btn");
const userInfo = document.getElementById("user-info");
const userName = document.getElementById("user-name");
const userPhoto = document.getElementById("user-photo");

// ✅ Handle Settings Dropdown
if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    settingsMenu.classList.toggle("active");
  });
}

// ✅ Sign In
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        console.log("Logged in as:", user.displayName);

        loginBtn.style.display = "none";
        settingsMenu.style.display = "inline-block";
        userInfo.style.display = "flex";

        userPhoto.src = user.photoURL;
        userName.textContent = user.displayName;

        // ✅ Save user to Firestore if not already there
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            followers: [],
            following: [],
            uploads: []
          });
          console.log("✅ New user added to Firestore");
        }

        // Optional: Send user info to backend
        fetch("http://localhost:5000/api/auth/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid
          })
        })
          .then(res => res.json())
          .then(data => {
            console.log("Token from backend:", data.token);
            localStorage.setItem("token", data.token);
          })
          .catch(err => console.error("Backend error:", err));
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error.message);
      });
  });
}

// ✅ Sign Out
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");

        loginBtn.style.display = "inline-block";
        settingsMenu.style.display = "none";
        userInfo.style.display = "none";
        userPhoto.src = "";
        userName.textContent = "";
        localStorage.removeItem("token");
      })
      .catch((error) => {
        console.error("Logout error:", error.message);
      });
  });
}

// ✅ Persist Login
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    settingsMenu.style.display = "inline-block";
    userInfo.style.display = "flex";
    userPhoto.src = user.photoURL;
    userName.textContent = user.displayName;
  } else {
    loginBtn.style.display = "inline-block";
    settingsMenu.style.display = "none";
    userInfo.style.display = "none";
  }
});
