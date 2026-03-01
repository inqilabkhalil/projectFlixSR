// ===== toggle password (səndə olan) =====
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.textContent = isPassword ? '🙈' : '👁';
  });
}

// ===== register API =====
const form = document.querySelector('.register-form');
const warningEl = document.getElementById('warning');

// Postman-dakı URL-ni bura yaz:
const registerUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup';

function showWarning(text) {
  warningEl.textContent = text;
  warningEl.style.display = 'block';
}

function hideWarning() {
  warningEl.textContent = '';
  warningEl.style.display = 'none';
}

async function registerUser(e) {
  e.preventDefault();
  hideWarning();

  const fullName = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!fullName || !email || !password) {
    showWarning('Bütün xanaları doldurun');
    return;
  }

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      password: password,
      full_name: fullName,
      email: email,
    }),
  };

  try {
    const response = await fetch(registerUrl, options);
    const data = await response.json();

    if (!response.ok || data.result === false) {
      // məsələn: "User is already exists"
      showWarning(data.message || 'Qeydiyyat alınmadı');
      return;
    }

    // uğurlu qeydiyyat → loginə yönləndir
    window.location.href = './login.html';
  } catch (err) {
    showWarning('Server xətası');
  }
}

form.addEventListener('submit', registerUser);

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const emailFromUrl = new URLSearchParams(window.location.search).get("email");

  if (!emailInput) return;

  // Autofill bəzən sonra yazır, ona görə biz də biraz sonra yazırıq
  setTimeout(() => {
    if (emailFromUrl) {
      emailInput.value = emailFromUrl; // URLSearchParams artıq decode edir
      emailInput.dispatchEvent(new Event("input", { bubbles: true }));
      emailInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, 50);
});