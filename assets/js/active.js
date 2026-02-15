const sidebarItems = document.querySelectorAll(".sideBar-item");

const dashboardItem  = document.querySelector(".dashBoardItem");
const movieItem      = document.querySelector(".movieItem");
const categoriesItem = document.querySelector(".categoriesItem");
const usersItem      = document.querySelector(".usersItem");
const commentsItem   = document.querySelector(".commentsItem");
const contactItem    = document.querySelector(".contactItem");

sidebarItems.forEach(item => item.classList.remove("active"));

const currentPage = window.location.pathname.toLowerCase();

if (currentPage.includes("dashboard")) {
  dashboardItem?.classList.add("active");
}
else if (currentPage.includes("movie")) {
  movieItem?.classList.add("active"); 
}
else if (currentPage.includes("category")) {
  categoriesItem?.classList.add("active");
}
else if (currentPage.includes("user")) {
  usersItem?.classList.add("active");
}
else if (currentPage.includes("comment")) {
  commentsItem?.classList.add("active");
}
else if (currentPage.includes("contact")) {
  contactItem?.classList.add("active");
}
