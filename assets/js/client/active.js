const homeItem = document.querySelector(".home-item");
const seriesItem = document.querySelector(".series-item");
const accountItem = document.querySelector(".account-item");
const favoriteItem = document.querySelector(".favorite-item");

let path = window.location.pathname.toLowerCase();

if (path.includes("home.html")) {
  homeItem.classList.add("active");
} else if (path .includes("series.html")) {
  seriesItem.classList.add("active");
} else if (path.includes("account.html")) {
  accountItem.classList.add("active");
} else if (path.includes("favorite.html")) {
  favoriteItem.classList.add("active");
}