const emailField = document.querySelector('input[name="email"]');
const passwordField = document.querySelector('input[name="password"]');
const loginForm = document.querySelector('#login-form');


const submitForm = (e) => {
  e.preventDefault();
  if (emailField.value.trim() === 'admin@mysite.com' && passwordField.value.trim() === 'admin') {
    document.location.href = './dashboard.html';
    return;
  }
  if (emailField.value.trim() === 'user@mysite.com' && passwordField.value.trim() === 'user') {
    document.location.href = './profile.html';
    return;
  }
  const errorContainer = document.querySelector('.errors');
  if (emailField.value.trim() === '' || passwordField.value.trim() === '') {
    errorContainer.innerHTML = '<p>No field should be empty</p>';
    errorContainer.style.opacity = '1';
    return;
  }
  errorContainer.innerHTML = '<p>Wrong email or password</p>';
  errorContainer.style.opacity = '1';
};


// EventListeners
loginForm.addEventListener('submit', submitForm);
