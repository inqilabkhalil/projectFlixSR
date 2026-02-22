// ===== AUTH GUARD =====
const accessToken = localStorage.getItem('access_token');

if (!accessToken) {
  window.location.href('/pages/client/login.html');
  console.log(window.location.href);
  // login path-ini layihənə görə düzəlt
}

// ===== LOGOUT =====
const logoutBtn = document.querySelector('.logout-text');

if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    localStorage.removeItem('access_token');
    window.location.replace('/pages/client/login.html');
  });
}
