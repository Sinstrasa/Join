const apiKey = "AIzaSyBBqXuaXjnWIvN5to5PuH5jif1FhT_9KKw";

// Signs the user in via REST and returns the parsed response
function signInUser(email, password) {
  return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST',
    body: JSON.stringify({ email: email, password: password, returnSecureToken: true })
  }).then(response => response.json());
}

// Stores the logged-in user's id and token for later use on other pages
function storeSession(data) {
  localStorage.setItem('uid', data.localId);
  localStorage.setItem('idToken', data.idToken);
}

// Handles login form submission: signs the user in and redirects on success
function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInUser(email, password)
    .then((data) => {
      if (data.error) throw data.error;
      storeSession(data);
      window.location.href = 'pages/summary.html';
    })
    .catch(() => handleLoginError());
}

// Displays a generic login error message
function handleLoginError() {
  const formStatus = document.getElementById('formStatus');
  formStatus.textContent = 'Invalid email or password.';
}

// Entry point: attaches the submit handler once the DOM is ready
function initSignIn() {
  document.querySelector('form').addEventListener('submit', handleLoginSubmit);
}

// document.addEventListener('DOMContentLoaded', initSignIn);