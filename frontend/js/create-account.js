import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const auth = getAuth(app);

const authMethod = document.getElementById("auth-method");
const emailInput = document.getElementById("email-input");
const phoneInput = document.getElementById("phone-input");

authMethod.addEventListener("change", () => {
  if (authMethod.value === "email") {
    emailInput.style.display = "block";
    phoneInput.style.display = "none";
  } else {
    emailInput.style.display = "none";
    phoneInput.style.display = "block";
  }
});

const form = document.getElementById("create-account-form");
const confirmationSection = document.getElementById("confirmation-section");
let confirmationResult;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const birthday = document.getElementById("birthday").value;

  if (authMethod.value === "email") {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully");
      window.location.href = "index.html";
    } catch (error) {
      alert("Error: " + error.message);
    }
  } else {
    const countryCode = document.getElementById("country-code").value;
    const phone = document.getElementById("phone-number").value;
    const fullPhoneNumber = countryCode + phone;

    window.recaptchaVerifier = new RecaptchaVerifier('create-account-form', {
      'size': 'invisible',
      'callback': () => {}
    }, auth);

    try {
      confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
      confirmationSection.style.display = "block";
    } catch (error) {
      alert("Phone auth error: " + error.message);
    }
  }
});

document.getElementById("verify-code-btn").addEventListener("click", async () => {
  const code = document.getElementById("confirmation-code").value;
  try {
    await confirmationResult.confirm(code);
    alert("Phone verified and account created");
    window.location.href = "index.html";
  } catch (error) {
    alert("Invalid code: " + error.message);
  }
});
