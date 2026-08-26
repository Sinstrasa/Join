import { auth, database } from "./firebaseConfig.js";

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", initUser);

function initUser() {
  setupLogoutButton();
  onAuthStateChanged(auth, handleAuthState);
}

function handleAuthState(user) {
  if (!user) return redirectToLogin();
  loadUserData(user.uid);
}

async function loadUserData(uid) {
  const snapshot = await get(ref(database, `users/${uid}`));
  if (!snapshot.exists()) return;
  displayProfileIcon(snapshot.val());
}

function displayProfileIcon(userData) {
  const profileIcon = document.getElementById("userInitial");
  if (!profileIcon) return;
  profileIcon.textContent = getUserInitial(userData);
}

function getUserInitial(userData) {
  const username = userData?.username || "";
  return username.charAt(0).toUpperCase();
}

function setupLogoutButton() {
  const logoutButton = document.getElementById("logoutButton");
  if (!logoutButton) return;
  logoutButton.addEventListener("click", handleLogout);
}

function handleLogout(event) {
  event.preventDefault();
  signOut(auth).then(redirectToLogin);
}

function redirectToLogin() {
  window.location.href = "../index.html";
}