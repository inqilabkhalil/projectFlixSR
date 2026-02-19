const warningEl = document.getElementById("warning");
const loginUrl = "https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin/login";
const form = document.querySelector(".login-form");

function showWarning(text) {
  warningEl.textContent = text;
  warningEl.style.display = "block";
}

// function hideWarning() {
//   warningEl.textContent = "";
//   warningEl.style.display = "none";
// }

async function login(event) {
  event.preventDefault(); 

//   hideWarning();

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
    const response = await fetch(loginUrl, options);
    const responseData = await response.json();

    if (!responseData.result) {
      showWarning(responseData.message);
      return;
    }

    const accessToken = responseData.data.tokens.access_token;
    localStorage.setItem("access_token", accessToken);

    window.location.href = "../admin/dashboard.html";
  } catch (error) {
    showWarning("Server xətası");
  }
}


form.addEventListener("submit", login);
