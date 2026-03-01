const BASE_URL = 'https://api.sarkhanrahimli.dev/api/filmalisa';
const TOKEN_KEY = 'client_token';

const form = document.querySelector('.account-form');

const profileImageUrlInput = document.getElementById('profileImageUrl');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('emaill');
const passwordInput = document.getElementById('password');

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// PROFILI ÇƏK
async function loadProfile() {
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error('Profile load failed');
    }

    const data = await res.json();

    const user = data.result || data.data || data;

    profileImageUrlInput.value = user.imageUrl || '';
    fullnameInput.value = user.fullName || user.fullname || '';
    emailInput.value = user.email || '';
  } catch (err) {
    console.error(err);
    alert('Profil yüklənmədi ❌');
  }
}

// PROFILI YENİLƏ
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    imageUrl: profileImageUrlInput.value.trim(),
    fullName: fullnameInput.value.trim(),
    ...(passwordInput.value.trim()
      ? { password: passwordInput.value.trim() }
      : {}),
  };

  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Update failed');
    }

    alert('Profil yeniləndi ✅');
    passwordInput.value = '';

    loadProfile();
  } catch (err) {
    console.error(err);
    alert('Yenilənmə alınmadı ❌');
  }
});

document.addEventListener('DOMContentLoaded', loadProfile);
