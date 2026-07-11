document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');
  const email = document.getElementById('adminEmail');
  const password = document.getElementById('adminPassword');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const rememberMe = document.getElementById('rememberMe');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const submitBtn = document.getElementById('loginSubmitBtn');

  // Demo admin credentials (front-end only — replace with real auth later)
  const VALID_EMAIL = 'admin@reviewflow.ai';
  const VALID_PASSWORD = 'admin123';
  const REMEMBER_KEY = 'graphuraAdminRememberedEmail';

  // ---- Remember Me: prefill remembered email on load ----
  const rememberedEmail = localStorage.getItem(REMEMBER_KEY);
  if (rememberedEmail) {
    email.value = rememberedEmail;
    rememberMe.checked = true;
  }

  // ---- Password show/hide toggle ----
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const isHidden = password.type === 'password';
      password.type = isHidden ? 'text' : 'password';
      togglePasswordBtn.textContent = isHidden ? '🙈' : '👁️';
      togglePasswordBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitBtn.classList.contains('is-loading')) return;

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

    // ---- Loading spinner while "logging in" ----
    const originalHTML = submitBtn.innerHTML;
    submitBtn.classList.add('is-loading');
    submitBtn.innerHTML = `<span class="btn-spinner"></span>Signing In...`;

    setTimeout(() => {
      if (emailValue !== VALID_EMAIL || passwordValue !== VALID_PASSWORD) {
        submitBtn.classList.remove('is-loading');
        submitBtn.innerHTML = originalHTML;
        passwordError.textContent = 'Invalid email or password.';
        email.classList.add('input-error');
        password.classList.add('input-error');
        showToast('Invalid credentials. Please try again.', { isError: true, duration: TOAST_DURATION.LONG });
        return;
      }

      if (rememberMe.checked) {
        localStorage.setItem(REMEMBER_KEY, emailValue);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      showToast('Login successful. Redirecting...', { duration: TOAST_DURATION.SHORT });

      setTimeout(() => {
        window.location.href = ROUTES.ADMIN.DASHBOARD;
      }, 500);
    }, 900);
  });

  [email, password].forEach((field) => {
    field.addEventListener('input', () => {
      field.classList.remove('input-error');
      const errorEl = field.id === 'adminEmail' ? emailError : passwordError;
      errorEl.textContent = '';
    });
  });
});