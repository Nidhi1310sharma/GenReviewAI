document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ownerLoginForm');
  const email = document.getElementById('ownerEmail');
  const password = document.getElementById('ownerPassword');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Demo owner credentials (front-end only — replace with real auth later)
  const VALID_EMAIL = 'cafearoma@reviewflow.com';
  const VALID_PASSWORD = 'cafearoma1234';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    emailError.textContent = '';
    passwordError.textContent = '';
    email.classList.remove('input-error');
    password.classList.remove('input-error');

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue) {
      emailError.textContent = 'Email address is required.';
      email.classList.add('input-error');
      isValid = false;
    }

    if (!passwordValue) {
      passwordError.textContent = 'Password is required.';
      password.classList.add('input-error');
      isValid = false;
    }

    if (!isValid) return;

    if (emailValue !== VALID_EMAIL || passwordValue !== VALID_PASSWORD) {
      emailError.textContent = '';
      passwordError.textContent = 'Invalid email or password.';
      email.classList.add('input-error');
      password.classList.add('input-error');
      return;
    }

    window.location.href = 'dashboard.html';
  });

  [email, password].forEach((field) => {
    field.addEventListener('input', () => {
      field.classList.remove('input-error');
      const errorEl = field.id === 'ownerEmail' ? emailError : passwordError;
      errorEl.textContent = '';
    });
  });
});