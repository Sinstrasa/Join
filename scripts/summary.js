import { auth, database } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// Loads the current user's data from the database and displays a greeting
function loadUserGreeting(uid) {
  get(ref(database, 'users/' + uid)).then((snapshot) => {
    const userData = snapshot.val();
    displayGreeting(userData);
  });
}

// Fills the greeting element with the user's name and applies their color
function displayGreeting(userData) {
  const greeting = document.getElementById('greeting');
  const userEmail = document.getElementById('user_email');
  greeting.textContent = `${userData.username}!`;
  greeting.style.color = `var(${userData.color})`;
  displayProfileIcon(userData);
}

// Entry point: waits for Firebase to confirm the logged-in user, then loads their data
function initSummary() {
  document.getElementById('logoutButton').addEventListener('click', handleLogout);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUserGreeting(user.uid);
    } else {
      window.location.href = '../pages/index.html';
    }
  });
}

// Fills the profile icon with the user's first initial
function displayProfileIcon(userData) {
  const profileIcon = document.getElementById('userInitial');
  profileIcon.textContent = userData.username.charAt(0).toUpperCase();
}

// Signs the current user out and redirects to the login page
function handleLogout(event) {
    event.preventDefault();
  signOut(auth).then(() => {
    window.location.href = '../index.html';
  });
}

document.addEventListener('DOMContentLoaded', initSummary);