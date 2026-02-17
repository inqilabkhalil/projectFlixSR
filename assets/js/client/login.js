

localStorage.removeItem("access_token");
localStorage.removeItem("user");

// Artıq token varsa login-ə girmək lazım deyil
const existingToken = localStorage.getItem('access_token');
if (existingToken) {
  const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
  // Role yoxla və uyğun səhifəyə yönləndir
  if (existingUser.role === 'Admin') {
    window.location.href = '../../../pages/admin/dashboard.html';
  } else {
    window.location.href = '../../../index.html';
  }
}




// ========== Şifrə göstər/gizlət ==========
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.getAttribute('type') === 'password';
  passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
  togglePassword.textContent = isPassword ? '🙈' : '👁';
});

// ========== Login formu ==========
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  errorMessage.style.display = 'none';
  errorMessage.textContent = '';

  try {
    const response = await fetch('https://api.sarkhanrahimli.dev/api/filmalisa/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      errorMessage.textContent = responseData.message || 'Email ve ya sifre yalnisdir.';
      errorMessage.style.display = 'block';
      return;
    }

    // Token-i localStorage-e yaz
    const accessToken = responseData.data.tokens.access_token;
    localStorage.setItem('access_token', accessToken);

    // User data-nı localStorage-e yaz
    if (responseData.data.user) {
      localStorage.setItem('user', JSON.stringify(responseData.data.user));
    }

    // Role əsasında yönləndir
    const role = responseData.data.user?.role;
    if (role === 'admin') {
      window.location.href = '../../admin/pages/dashboard.html';
    } else {
      window.location.href = './index.html';
    }

  } catch (error) {
    console.error('Login xetasi:', error);
    errorMessage.textContent = 'Error.';
    errorMessage.style.display = 'block';
  }
});