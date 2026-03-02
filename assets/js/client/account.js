const BASE_URL = 'https://api.sarkhanrahimli.dev/api/filmalisa';
const TOKEN_KEY = 'client_token';
const EMAIL_KEY = 'client_email';

const form = document.querySelector('.account-form');

const profileImageUrlInput = document.getElementById('profileImageUrl');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('emaill');
const passwordInput = document.getElementById('password');
const avatarImg = document.getElementById('avatarImg');

let serverFullName = '';
let serverEmail = '';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const baseHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  let res = await fetch(url, {
    ...options,
    headers: { ...baseHeaders, Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    res = await fetch(url, {
      ...options,
      headers: { ...baseHeaders, Authorization: token },
    });
  }

  return res;
}

// ================= LOAD PROFILE =================
async function loadProfile() {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/profile`, { method: 'GET' });
    if (!res) return;

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Profile load failed: ${res.status} ${txt}`);
    }

    const result = await res.json();
    const user = result.data;

    serverFullName = user?.full_name ?? '';
    serverEmail = user?.email ?? '';

    fullnameInput.value = '';

    profileImageUrlInput.value = user?.img_url ?? '';

    if (user?.img_url && avatarImg) {
      avatarImg.src = user.img_url;
    }

    if (serverEmail) {
      emailInput.value = serverEmail;
      localStorage.setItem(EMAIL_KEY, serverEmail);
    }
  } catch (err) {
    console.error(err);
    notifyError('Profil yüklənmədi ❌');
  }
}

// ================= UPDATE PROFILE =================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const img_url = profileImageUrlInput.value.trim();
  const full_name_ui = fullnameInput.value.trim();
  const password = passwordInput.value.trim();

  const email =
    emailInput.value.trim() ||
    localStorage.getItem(EMAIL_KEY) ||
    serverEmail;

  const payload = { email };

  if (img_url) payload.img_url = img_url;

  const finalFullName = full_name_ui || serverFullName;
  if (finalFullName) payload.full_name = finalFullName;

  if (password) payload.password = password;

  try {
    const res = await fetchWithAuth(`${BASE_URL}/profile`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (!res) return;

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Update failed: ${res.status} ${txt}`);
    }

    passwordInput.value = '';
    await loadProfile();
    notifySuccess('Profil yeniləndi ✅');
  } catch (err) {
    console.error(err);
    notifyError(err.message || 'Profil yenilənmədi');
  }
});

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem(EMAIL_KEY);
  if (savedEmail) emailInput.value = savedEmail;

  loadProfile();
});