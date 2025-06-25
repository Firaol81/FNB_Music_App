// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6AKaS6k9__rklMiP9iVNjHEcKr8jLA3w",
  authDomain: "fnb-studio-application.firebaseapp.com",
  projectId: "fnb-studio-application",
  storageBucket: "fnb-studio-application.appspot.com",
  messagingSenderId: "385097682668",
  appId: "1:385097682668:web:1c5069d9e37e689beb9fc9",
  measurementId: "G-ZQTWE441M9"
};

export const app = initializeApp(firebaseConfig);
