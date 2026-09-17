const apiKey = "AIzaSyBBqXuaXjnWIvN5to5PuH5jif1FhT_9KKw";

const guestEmail = "guest@join.de";
const guestPassword = "Guest123!";

// Signs the user in via REST and returns the parsed response
function signInUser(email, password) {
  const url = getSignInUrl();
  const data = { email, password, returnSecureToken: true };

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => response.json());
}

// Returns the Firebase REST login URL
function getSignInUrl() {
  return `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
}

// Stores the logged-in user's id and token
function storeSession(data) {
  localStorage.setItem("uid", data.localId);
  localStorage.setItem("idToken", data.idToken);
}

// Handles normal login
function handleLoginSubmit(event) {
  event.preventDefault();

  localStorage.removeItem("isGuest");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  loginAndRedirect(email, password);
}

// Handles guest login
function handleGuestLogin() {
  localStorage.setItem("isGuest", "true");
  loginAndRedirect(guestEmail, guestPassword);
}

// Signs in and redirects to summary
function loginAndRedirect(email, password) {
  signInUser(email, password)
    .then(handleLoginResponse)
    .catch(handleLoginError);
}

// Processes Firebase login response
function handleLoginResponse(data) {
  if (data.error) {
    handleLoginError();
    return;
  }

  storeSession(data);
  window.location.href = "pages/summary.html";
}

// Displays login error
function handleLoginError() {
  const formStatus = document.getElementById("formStatus");
  formStatus.textContent = "Invalid email or password.";
}

// Registers login events
function initSignIn() {
  const form = document.querySelector("form");
  const guestButton = document.getElementById("guestLoginButton");

  form.addEventListener("submit", handleLoginSubmit);
  guestButton.addEventListener("click", handleGuestLogin);
}

