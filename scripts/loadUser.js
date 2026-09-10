function initAddTaskPage() {
  initProfileMenu();
  setupLogoutButton();
  initAddTask();
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

  subnavigation.addEventListener(
    "click",
    stopProfilePropagation
  );
}

function stopProfilePropagation(event) {
  event.stopPropagation();
}

function setupLogoutButton() {
  const button = document.getElementById("logoutButton");

  if (!button) return;

  button.addEventListener("click", handleLogout);
}

async function handleLogout(event) {
  event.preventDefault();

  try {
    await joinAuth.signOut();
    window.location.replace("../index.html");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

function initInformationPage() {
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