function isFormValid() {
  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const acceptPrivacy = document.getElementById('acceptPrivacy');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const allFilled = username.value.trim() !== '' &&
                     email.value.trim() !== '' &&
                     password.value.trim() !== '' &&
                     confirmPassword.value.trim() !== '';
  const passwordLongEnough = password.value.length >= 8;
  const passwordsMatch = password.value === confirmPassword.value;
  setFieldError(passwordError, password.value !== '', passwordLongEnough, 'Password must be at least 8 characters.');
  setFieldError(confirmPasswordError, confirmPassword.value !== '', passwordsMatch, 'Passwords do not match.');
  return allFilled && passwordLongEnough && passwordsMatch && acceptPrivacy.checked;
}

function setFieldError(errorElement, hasValue, isValid, message) {
  errorElement.textContent = (hasValue && !isValid) ? message : '';
}

function updateSubmitButtonState() {
  const submitButton = document.getElementById('signUpButton');
  submitButton.disabled = !isFormValid();
}

function initSignUp() {
  document.getElementById('acceptPrivacy').addEventListener('change', updateSubmitButtonState);
  document.getElementById('username').addEventListener('input', updateSubmitButtonState);
  document.getElementById('email').addEventListener('input', updateSubmitButtonState);
  document.getElementById('password').addEventListener('input', updateSubmitButtonState);
  document.getElementById('confirmPassword').addEventListener('input', updateSubmitButtonState);

  updateSubmitButtonState();
}