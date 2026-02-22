const sidebarItems = document.querySelectorAll(".sideBar-item");
console.log("active")
console.log("ACTIVE JS RUNNING", window.location.pathname);

const dashboardItem  = document.querySelector(".dashBoardItem");
const movieItem      = document.querySelector(".movieItem");
const categoriesItem = document.querySelector(".categoriesItem");
const usersItem      = document.querySelector(".usersItem");
const commentsItem   = document.querySelector(".commentsItem");
const contactItem    = document.querySelector(".contactItem");
const actorsItem     = document.querySelector(".actorsItem");

sidebarItems.forEach(item => item.classList.remove("active"));

const currentPageActive = window.location.pathname.toLowerCase();

if (currentPageActive.includes("dashboard")) {
  dashboardItem?.classList.add("active");
  
}
else if (currentPageActive.includes("movie")) {
  movieItem?.classList.add("active"); 
}
else if (currentPageActive.includes("categories")) {
  categoriesItem?.classList.add("active");
}
else if (currentPageActive.includes("user")) {
  usersItem?.classList.add("active");
}
else if (currentPageActive.includes("comment")) {
  commentsItem?.classList.add("active");
}
else if (currentPageActive.includes("contact")) {
  contactItem?.classList.add("active");
}
else if (currentPageActive.includes("actor")) {
  actorsItem?.classList.add("active");
}
