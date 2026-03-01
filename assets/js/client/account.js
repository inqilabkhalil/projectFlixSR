const BASE_URL = 'https://api.sarkhanrahimli.dev/api/filmalisa';
const TOKEN_KEY = 'client_token';
const EMAIL_KEY = 'client_email';

const form = document.querySelector('.account-form');

const profileImageUrlInput = document.getElementById('profileImageUrl');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('emaill');
const passwordInput = document.getElementById('password');

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// 401 olarsa Bearer-sız da yoxlayırıq (səndə tez-tez bu problem olur)
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

// PROFILI ÇƏK
async function loadProfile() {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/profile`, { method: 'GET' });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Profile load failed: ${res.status} ${txt}`);
    }

    const data = await res.json();

    // Sənin API: data.data.profile
    const user = data?.data?.profile || data?.profile || data;

    // snake_case field-lər
    const fullName = user?.full_name;
    const imgUrl = user?.img_url;
    const email = user?.email;

    // full_name və img_url boş ola bilər – boşdursa "" yazırıq
    fullnameInput.value = fullName ?? '';
    profileImageUrlInput.value = imgUrl ?? '';

    // EMAIL: yalnız varsa yaz, yoxdursa əvvəlkini silmə!
    if (email) {
      emailInput.value = email;
      localStorage.setItem(EMAIL_KEY, email);
    }
  } catch (err) {
    console.error(err);
    // email localStorage-dan görünsün deyə alert versək də input boşalmayacaq
    alert('Profil yüklənmədi ❌');
  }
}

// PROFILI YENİLƏ (email göndərmirik!)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    img_url: profileImageUrlInput.value.trim(),
    full_name: fullnameInput.value.trim(),
    ...(passwordInput.value.trim()
      ? { password: passwordInput.value.trim() }
      : {}),
  };

  try {
    const res = await fetchWithAuth(`${BASE_URL}/profile`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Update failed: ${res.status} ${txt}`);
    }

    alert('Profil yeniləndi ✅');
    passwordInput.value = '';
    loadProfile();
  } catch (err) {
    console.error(err);
    alert('Yenilənmə alınmadı ❌');
  }
});

// INIT: refresh edən kimi email dərhal görünsün
document.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem(EMAIL_KEY);
  if (savedEmail) emailInput.value = savedEmail; // disabled olsa da value yazılır

  loadProfile();
});
