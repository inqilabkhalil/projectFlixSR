function preventAuthPagesIfAuthenticated() {
  const guardToken = localStorage.getItem("access_token");
  const currentPage = window.location.pathname;

  if (
    guardToken &&
    (currentPage.includes("login.html") ||
     currentPage.includes("register.html"))
  ) {
    window.location.replace("./dashboard.html");
  }
}

preventAuthPagesIfAuthenticated();