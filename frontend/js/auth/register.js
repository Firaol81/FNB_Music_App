import { app } from "./firebaseConfig.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const auth = getAuth(app);

// Show/hide phone/email fields
const authMethod = document.getElementById("auth-method");
const emailInput = document.getElementById("email");
const phoneContainer = document.getElementById("phone-container");

authMethod.addEventListener("change", () => {
  const method = authMethod.value;
  emailInput.style.display = method === "email" ? "block" : "none";
  phoneContainer.style.display = method === "phone" ? "block" : "none";
});

// Firebase phone verification
let confirmationResult;

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (authMethod.value === "phone") {
    const countryCode = document.getElementById("country-code").value;
    const phoneNumber = document.getElementById("phone-number").value;
    const fullPhone = `${countryCode}${phoneNumber}`;

    window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
      size: "invisible",
      callback: () => {}
    }, auth);

    try {
      confirmationResult = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      document.getElementById("confirmation-code-container").style.display = "block";
      alert("✅ Code sent to your phone.");
    } catch (error) {
      alert("❌ Error sending code: " + error.message);
    }
  } else {
    alert("📧 Email signup not implemented yet.");
  }
});

// Code verification
document.getElementById("verify-code-btn").addEventListener("click", async () => {
  const code = document.getElementById("confirmation-code").value;

  try {
    await confirmationResult.confirm(code);
    alert("🎉 Account created successfully!");
    window.location.href = "index.html";
  } catch (error) {
    alert("⚠️ Invalid code.");
  }
});
