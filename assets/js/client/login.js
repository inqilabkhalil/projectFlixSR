const login_url =
  "https://api.sarkhanrahimli.dev/api/filmalisa/auth/login";
const form = document.querySelector(".login-form");
const warningEl = document.getElementById("warning");

function showWarning(text) {
  warningEl.textContent = text;
  warningEl.style.display = "block";
}

async function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showWarning("Email/username və şifrə boş ola bilməz");
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
    const response = await fetch(login_url, options);
    const responseData = await response.json();
    if (!responseData.result) {
      showWarning("server xətası");
      return;
    }
    const accessToken = responseData.data.tokens.access_token;
    localStorage.setItem("client_token", accessToken);
    window.location.href = "../client/home.html";
  } catch (error) {
    showWarning("Server xətası");
  }
}

form.addEventListener("submit", login);
