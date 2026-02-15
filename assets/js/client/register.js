const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    // istəsən ikon dəyişsin
    togglePassword.textContent = isPassword ? "🙈" : "👁";
  });
}