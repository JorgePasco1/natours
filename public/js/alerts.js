/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.remove();
};

// Type is success or error
export const showAlert = (type, msg, time = 5) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup); // Inside of the body, but right at the beginning
  window.setTimeout(hideAlert, time * 1000);
};
