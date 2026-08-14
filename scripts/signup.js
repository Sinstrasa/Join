import { auth, database } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


// Collects references to all form fields and error elements needed for validation
function getFormFields() {
  return {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    acceptPrivacy: document.getElementById('acceptPrivacy'),
    passwordError: document.getElementById('passwordError'),
    confirmPasswordError: document.getElementById('confirmPasswordError'),
    emailError: document.getElementById('emailError')
  };
}
// Validates all sign-up fields, updates error messages, and returns whether the form is valid overall
function isFormValid() {
  const form = getFormFields();
  const allFilled = form.username.value.trim() !== '' && form.email.value.trim() !== '' && form.password.value.trim() !== '' && form.confirmPassword.value.trim() !== '';
  const passwordLongEnough = form.password.value.length >= 8;
  const passwordsMatch = form.password.value === form.confirmPassword.value;
  const emailValid = isValidEmail(form.email.value);

  setFieldError(form.passwordError, form.password.value !== '', passwordLongEnough, 'Password must be at least 8 characters.');
  setFieldError(form.confirmPasswordError, form.confirmPassword.value !== '', passwordsMatch, 'Passwords do not match.');
  setFieldError(form.emailError, form.email.value !== '', emailValid, 'Please enter a valid email address.');

  return allFilled && passwordLongEnough && passwordsMatch && emailValid && form.acceptPrivacy.checked;
}

// Checks whether a string matches a basic email pattern (something@something.something)
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Shows or clears an error message on a field, depending on whether it has content and is valid
function setFieldError(errorElement, hasValue, isValid, message) {
  errorElement.textContent = (hasValue && !isValid) ? message : '';
}

// Enables or disables the submit button based on current form validity
function updateSubmitButtonState() {
  const submitButton = document.getElementById('signUpButton');
  submitButton.disabled = !isFormValid();
}

// Registers all event listeners for the sign-up form and sets the initial button state
function initSignUp() {
  document.querySelector('.signUpForm').addEventListener('submit', handleSignUpSubmit);
  document.getElementById('acceptPrivacy').addEventListener('change', updateSubmitButtonState);
  document.getElementById('username').addEventListener('input', updateSubmitButtonState);
  document.getElementById('email').addEventListener('input', updateSubmitButtonState);
  document.getElementById('password').addEventListener('input', updateSubmitButtonState);
  document.getElementById('confirmPassword').addEventListener('input', updateSubmitButtonState);

  updateSubmitButtonState();
}

document.addEventListener('DOMContentLoaded', initSignUp);

// Writes the new user's username and email to the Realtime Database under their uid
function saveUserToDatabase(uid, username, email) {
  return set(ref(database, 'users/' + uid), {
    username: username,
    email: email,
    color: getRandomContactColor() // Assigns a random contact color to the user
  });
}

// Handles form submission: validates, creates the Firebase Auth account, saves user data, then redirects
function handleSignUpSubmit(event) {
  event.preventDefault();
  if (!isFormValid()) return;

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const emailError = document.getElementById('emailError');

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => saveUserToDatabase(userCredential.user.uid, username, email))
    .then(() => showSuccessOverlay())
    .catch((error) =>  handleSignUpError(error, emailError));
}

// Displays a specific error message for a duplicate email, logs other errors to the console
function handleSignUpError(error, emailErrorElement) {
  if (error.code === 'auth/email-already-in-use') {
    emailErrorElement.textContent = 'This email is already in use.';
  } else {
    console.error(error);
  }
}

// Shows the success overlay for a short time before redirecting
function showSuccessOverlay() {
  const overlay = document.getElementById('successOverlay');
  overlay.hidden = false;

  setTimeout(() => {
    window.location.href = '../index.html';
  }, 2000);
}


function getRandomContactColor() {
  const randomColor = Math.floor(Math.random() *15) + 1; // Generates a random number between 1 and 15
  return '--contact_color_' + randomColor; // Returns the corresponding CSS variable name
}