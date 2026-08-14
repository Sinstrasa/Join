import { auth } from "./scripts/firebaseConfig.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// Handles login form submission: signs the user in and redirects on success
function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = './pages/summary.html')
    .catch((error) => handleLoginError(error));
}

// Displays a login error message based on the Firebase error code
function handleLoginError(error) {
  const formStatus = document.getElementById('formStatus');
  formStatus.textContent = 'Invalid email or password.';
}

// Entry point: attaches the submit handler once the DOM is ready
function initSignIn() {
  document.querySelector('form').addEventListener('submit', handleLoginSubmit);
}

document.addEventListener('DOMContentLoaded', initSignIn);