const homeItem = document.querySelector(".home-item");
const seriesItem = document.querySelector(".series-item");
const accountItem = document.querySelector(".account-item");
const favoriteItem = document.querySelector(".favorite-item");

window.location.pathname.toLowerCase();

if (window.location.pathname.includes("home.html")) {
  homeItem.classList.add("active");
} else if (window.location.pathname.includes("searchPanel.html")) {
  seriesItem.classList.add("active");
} else if (window.location.pathname.includes("account.html")) {
  accountItem.classList.add("active");
} else if (window.location.pathname.includes("favorite.html")) {
  favoriteItem.classList.add("active");
}