const toggle = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

toggle.addEventListener("click", () => {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
});
