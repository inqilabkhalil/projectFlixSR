
function checkAuth() {
  const token = localStorage.getItem("access_token");
  
  // Əgər token yoxdursa (kimsə birbaşa linklə girməyə çalışırsa), loginə at
  if (!token) {
    window.location.replace("./login.html"); // Və ya tam yol: "/gapes/client/login.html"
  }
}

// Səhifə yüklənəndə yoxla
checkAuth();

// Əlavə qoruma: Başqa tabda token silinərsə
window.addEventListener('storage', (event) => {
  if (event.key === 'access_token' && !event.newValue) {
    window.location.replace("./login.html");
  }
});