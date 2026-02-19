// 1. SƏHİFƏ YÜKLƏNƏNDƏ TOKEN YOXLANIŞI: 
// Əgər token varsa, birbaşa home.html-ə yönləndir
if (localStorage.getItem("access_token")) {
  window.location.href = "./home.html"; 
  
}

const toggle = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const warningEl = document.getElementById("warning");
const loginUrl = "https://api.sarkhanrahimli.dev/api/filmalisa/auth/login";
const form = document.getElementById("loginForm"); 

// Şifrəni göstər/gizlət məntiqi
toggle.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

// Xəta mesajını göstərmək üçün funksiya
function showWarning(text) {
  if (warningEl) {
    warningEl.textContent = text;
    warningEl.style.display = "block";
  } else {
    alert(text); // Əgər HTML-də warning id-si unudulubsa, ekrana xəbərdarlıq çıxarsın
  }
}

// Login funksiyası
async function login(event) {
  event.preventDefault();
  
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showWarning("Email və şifrə boş ola bilməz");
    return;
  }

  const options = {
    method: "POST",
    headers: {  
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  try {
    const response = await fetch(loginUrl, options);
    const responseData = await response.json();
    
    // API-dən xəta gələrsə
    if (!responseData.result && !response.ok) {
      showWarning(responseData.message || "İstifadəçi adı və ya şifrə yanlışdır.");
      return;
    }

    // Uğurlu giriş: Tokeni al və yadda saxla
    const accessToken = responseData.data.tokens.access_token;
    localStorage.setItem("login_token", accessToken);
    
    window.location.href = "./home.html"; 

  } catch (error) {
    showWarning("Server xətası, zəhmət olmasa daha sonra yenidən cəhd edin.");
    console.error(error);
  }
}

form.addEventListener("submit", login);



