function initAddTaskPage() {
  initProfileMenu();
  setupLogoutButton();
  initAddTask();
}

function initInformationPage() {
  const uid = localStorage.getItem("uid");

  if (!uid) {
    window.location.href = "../index.html";
    return;
  }

  loadOwnProfile(uid);
  initProfileMenu();
  setupLogoutButton();
  setupBackButton();
}

function initProfileMenu() {
  const button = document.getElementById("profileButton");
  const navigation = document.getElementById("nav");

  if (!button || !navigation) return;

  button.addEventListener("click", openProfileMenu);
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

  subnavigation.addEventListener("click", stopProfilePropagation);
}

function stopProfilePropagation(event) {
  event.stopPropagation();
}

function setupLogoutButton() {
  const button = document.getElementById("logoutButton");
  if (!button) return;

  button.addEventListener("click", handleLogout);
}

function handleLogout(event) {
  event.preventDefault();

  localStorage.removeItem("uid");
  localStorage.removeItem("idToken");
  localStorage.removeItem("isGuest");

  window.location.replace("../index.html");
}

function setupBackButton() {
  const button = document.getElementById("backButton");
  if (!button) return;

  button.addEventListener("click", goBack);
}

function goBack() {
  history.back();
}

function loadOwnProfile(uid) {
  if (isGuestUser()) {
    showProfileInitials("G");
    return;
  }

  loadUserProfile(uid);
}

function isGuestUser() {
  return localStorage.getItem("isGuest") === "true";
}

function loadUserProfile(uid) {
  fetch(`${baseUrl}users/${uid}.json`)
    .then((response) => response.json())
    .then(showUserInitials)
    .catch(handleProfileError);
}

function showUserInitials(user) {
  if (!user) return;

  const name = user.name || user.username || "";
  showProfileInitials(getInitials(name));
}

function showProfileInitials(initials) {
  const element =
    document.getElementById("userInitial") ||
    document.querySelector(".profile_icon p");

  if (!element) return;

  element.textContent = initials;
}

function handleProfileError(error) {
  console.error("Profile could not be loaded:", error);
}