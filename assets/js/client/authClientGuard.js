function preventAuthPagesIfAuthenticated() {
    const clientGuardToken = localStorage.getItem("client_token");
    const currentPage = window.location.pathname;

    if (
        clientGuardToken &&
        (currentPage.includes("login.html") ||
            currentPage.includes("register.html"))
    ) {
        window.location.replace("./home.html");
    }
}

preventAuthPagesIfAuthenticated();