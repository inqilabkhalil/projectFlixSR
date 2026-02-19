new Swiper('.swiper', {
  slidesPerView: 3,
  spaceBetween: 16,
  grabCursor: true,
});

const watchBtn = document.querySelector(".watchBtn");
const modalEl = document.getElementById("playModal");
const modal = new bootstrap.Modal(modalEl);
const closeBtn = modalEl.querySelector(".playModal__close");
const detailMovieImg = document.querySelector(".detailMovieImg");
const detailPlayBtn = document.querySelector(".detail-play-btn");
function closePlayModal() {
  modal.hide();
}

closeBtn.addEventListener("click",closePlayModal);
function openPlayModal() {
  modal.show();
}

detailMovieImg.addEventListener("click", openPlayModal);
detailPlayBtn.addEventListener("click", openPlayModal);