/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM ElEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    login(email.value, password.value);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup_name');
    const email = document.getElementById('signup_email');
    const password = document.getElementById('signup_password');
    const passwordConfirm = document.getElementById('signup_confirm_password');

    signup(name.value, email.value, password.value, passwordConfirm.value);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  try {
    userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveButton = document.querySelector('.btn--save-password');
      saveButton.textContent = 'Updating...';

      const oldPassword = document.getElementById('password-current');
      const newPassword = document.getElementById('password');
      const passwordConfirm = document.getElementById('password-confirm');
      await updateSettings(
        {
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
          passwordConfirm: passwordConfirm.value,
        },
        'password'
      );
      saveButton.textContent = 'Save password';

      oldPassword.value = '';
      newPassword.value = '';
      passwordConfirm.value = '';
    });
  } catch {
    console.log('Something went wrong');
  }
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alert) showAlert('success', alertMessage, 15);
