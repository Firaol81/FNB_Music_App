import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { app } from "./firebase-init.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const mySongsLink = document.getElementById("my-songs-link");
    if (mySongsLink) {
      mySongsLink.href = `profile.html?uid=${user.uid}`;
    }
  }
});
