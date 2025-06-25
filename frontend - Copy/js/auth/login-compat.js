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

// ✅ Initialize Firebase v8 style
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ✅ Sign in with Google
document.getElementById("google-login-btn")?.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;

      document.getElementById("user-info").style.display = "flex";
      document.getElementById("user-photo").src = user.photoURL;
      document.getElementById("user-name").innerText = user.displayName;

      document.getElementById("google-login-btn").style.display = "none";
      document.getElementById("settings-menu").style.display = "block";
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      alert("Login error: " + error.message);
    });
});

// ✅ Logout
document.getElementById("logout-btn")?.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.reload();
  });
});

// ✅ Auto-detect auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("user-info").style.display = "flex";
    document.getElementById("user-photo").src = user.photoURL;
    document.getElementById("user-name").innerText = user.displayName;

    document.getElementById("google-login-btn").style.display = "none";
    document.getElementById("settings-menu").style.display = "block";
  } else {
    document.getElementById("google-login-btn").style.display = "inline-block";
    document.getElementById("settings-menu").style.display = "none";
    document.getElementById("user-info").style.display = "none";
  }
});
