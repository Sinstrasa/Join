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
  const button = document.getElementById("logoutButton");
  if (!button) return;
  button.addEventListener("click", handleLogout);
}

async function handleLogout(event) {
  event.preventDefault();
  try {
    await signOut(auth);
    redirectToLogin();
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

function redirectToLogin() {
  window.location.replace("../index.html");
}

// Provisiorisches Menü fix

document.addEventListener("DOMContentLoaded", initProfileMenu);

function initProfileMenu() {
  const profileButton = document.getElementById("profileButton");
  const navigation = document.getElementById("nav");
  if (!profileButton || !navigation) return;
  profileButton.addEventListener("click", openProfileMenu);
  navigation.addEventListener("click", closeProfileMenu);
  initSubnavigation();
}

function openProfileMenu() {
  const navigation = document.getElementById("nav");
  if (!navigation) return;
  navigation.showModal();
}

function closeProfileMenu() {
  const navigation = document.getElementById("nav");
  if (!navigation) return;
  navigation.close();
}

function initSubnavigation() {
  const subnavigation = document.getElementById("subnavigation");
  if (!subnavigation) return;
  subnavigation.addEventListener("click", stopPropagation);
}

function stopPropagation(event) {
  event.stopPropagation();
}