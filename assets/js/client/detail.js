new Swiper('.swiper', {
  slidesPerView: 3,
  spaceBetween: 16,
  grabCursor: true,
});

const watchBtn = document.querySelector(".watchBtn");
const modalEl = document.getElementById("playModal");
const modal = new bootstrap.Modal(modalEl);
const closeBtn = modalEl.querySelector(".playModal__close");

function closePlayModal() {
  modal.hide();
}

closeBtn.addEventListener("click", (e) => {
  closePlayModal();
});
function openPlayModal() {
  modal.show();
}

watchBtn.addEventListener("click", (e) => {
  openPlayModal();
});