
const similarSwiper = new Swiper(".similarSwiper", {
  slidesPerView: 3,
  spaceBetween: 16,
  grabCursor: true,
});

// ✅ TOKEN LOCAL STORAGE-DƏN

const token = localStorage.getItem("client_token");

if (!token) window.location.href = "./login.html";

const watchBtn = document.querySelector(".watchBtn");

const modalEl = document.getElementById("playModal");
const modal = new bootstrap.Modal(modalEl);
const closeBtn = modalEl.querySelector(".playModal__close");

const modalHero = modalEl.querySelector(".playModal__hero");
const modalImg = modalEl.querySelector(".playModal__img");
const modalIframe = modalEl.querySelector(".playModal__iframe");
const modalOverlay = modalEl.querySelector(".playModal__overlay");
const modalTitle = modalEl.querySelector(".playModal__title");
const modalPlayBtn = modalEl.querySelector(".playModal__btn");

const movieImg = document.querySelector(".movieImg");
const detailMovieImg = document.querySelector(".detailMovieImg");
const detailPlayBtn = document.querySelector(".detail-play-btn");

const movieName = document.querySelector(".movieName");
const movieTitleSpan = document.querySelector(".movieTitleSpan");

const detailHeaderTitle = document.querySelector(".detail-header-left-h1");
const detailDescription = document.querySelector(".detail-description");
const detailRating = document.querySelector(".detail-rating");

const typeText = document.querySelector(".aboutMovie .aboutMovie-item .data-text");
const runTimeText = document.querySelector(".episodeRunTime .data-text");
const genresName = document.querySelector(".genres-name");

const actorsList = document.querySelector(".actors-list");

const commentInput = document.querySelector(".commentInput");
const commentBtn = document.querySelector(".commentBtn");

const commentsContainer = document.querySelector(".comment-title");
const addMyFavoriteBtn = document.querySelector(".addMyListBtn");

// ===== URL PARAM =====
const params = new URLSearchParams(window.location.search);
const currentId = params.get("id");

function closePlayModal() {
  modal.hide();
  resetPlayer();
}

closeBtn.addEventListener("click", closePlayModal);

function openPlayModal() {
  modal.show();
}

detailMovieImg.addEventListener("click", openPlayModal);
detailPlayBtn.addEventListener("click", openPlayModal);

function toYoutubeEmbed(url) {
  if (!url) return "";

  // youtu.be/VIDEO_ID
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}?autoplay=1&rel=0`;

  // youtube.com/watch?v=VIDEO_ID
  const v = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (v) return `https://www.youtube.com/embed/${v[1]}?autoplay=1&rel=0`;

  // artıq embeddirsə
  if (url.includes("/embed/")) {
    return url + (url.includes("?") ? "&" : "?") + "autoplay=1&rel=0";
  }

  return url;
}
// ================= MOVIE =================
async function GetByIdMovie() {
  if (!currentId) {
    window.location.href = "./404.html";
    return;
  }

  const option = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${currentId}`;
  const response = await fetch(url, { method: "GET", headers: option });

  // ✅ 404: server cavabı OK deyilsə (məs: 404, 500)
  if (!response.ok) {
    window.location.href = "./404.html";
    return;
  }

  const movie = await response.json();

  // ✅ 404: API result=false və ya data boşdursa
  if (!movie?.result || !movie?.data) {
    window.location.href = "./404.html";
    return;
  }

  const filteredData = movie.data;

  movieImg.src = filteredData.cover_url;
  detailMovieImg.src = filteredData.cover_url;
  modalImg.src = filteredData.cover_url;

  movieName.textContent = filteredData.title;
  detailHeaderTitle.textContent = filteredData.title;
  modalTitle.textContent = filteredData.title;

  movieTitleSpan.textContent = filteredData.category?.name ?? "-";
  typeText.textContent = filteredData.category?.name ?? "-";
  genresName.textContent = `Genres: ${filteredData.category?.name ?? "-"}`;

  detailDescription.textContent = filteredData.overview ?? "";
  detailRating.innerHTML = `<i class="fa-solid fa-star"></i> ${filteredData.imdb ?? "-"}`;
  runTimeText.textContent = `${filteredData.run_time_min ?? "-"} min`;

  watchBtn.onclick = () => window.location.href = filteredData.watch_url;

  modalPlayBtn.onclick = () => {
    modalImg.style.display = "none";
    modalOverlay.style.display = "none";
    modalIframe.style.display = "block";
    modalIframe.src = toYoutubeEmbed(filteredData.fragman);
  };
function resetPlayer() {
  // videonu dayandır
  modalIframe.src = "";

  // UI-ni əvvəlki vəziyyətə qaytar (istəsən)
  modalIframe.style.display = "none";
  modalImg.style.display = "block";
  modalOverlay.style.display = "block";
}

// X, overlay click, ESC hamısında işləyəcək
modalEl.addEventListener("hidden.bs.modal", resetPlayer);
  if (Array.isArray(filteredData.actors)) {
    actorsList.innerHTML = filteredData.actors.map(actor => {
      const fullName = `${actor.name?.trim() ?? ""} ${actor.surname?.trim() ?? ""}`.trim();
      return `
        <div class="actor-card">
          <img src="${actor.img_url}" alt="${fullName}" />
          <p class="actor-name">${fullName}</p>
          <span class="actor-role"></span>
        </div>
      `;
    }).join("");
  }
  addMyFavoriteBtn.textContent = filteredData.is_favorite ? "-" : "+";
}
GetByIdMovie();

// ================= GET COMMENTS =================
async function getAllComments() {
  // ✅ 404: id yoxdursa
  if (!currentId) {
    window.location.href = "./404.html";
    return;
  }

  const option = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${currentId}/comments`;

  const response = await fetch(url, { method: "GET", headers: option });
  if (!response.ok) return;

  const comments = await response.json();

  if (!comments.result || !Array.isArray(comments.data)) {
    commentsContainer.innerHTML = "";
    return;
  }

  const filtData = comments.data.map(item => {
    return `
      <div class="single-comment">
        <div class="comment-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <img
              src="${item.user?.img_url || '../../assets/img/sarkhanmuellim.svg'}"
              alt="user"
              class="comment-user-img"
            />
            <p class="comment-user-name" style="margin:0;">
              ${item.user?.full_name || "User"}
            </p>
          </div>

          <span style="margin-left:auto;opacity:.6;font-size:13px;color:#999;">
            ${item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
          </span>
        </div>

        <p class="comment-text" style="margin:8px 0 0 0;">
          ${item.comment || ""}
        </p>
      </div>
    `;
  }).join("");

  commentsContainer.innerHTML = filtData;
}
getAllComments();

// ================= ADD COMMENT =================
async function addComment(e) {
  if (!currentId) {
    window.location.href = "./404.html";
    return;
  }

  if (e) e.preventDefault();

  const commentText = commentInput.value.trim();
  if (!commentText) return;

  const option = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${currentId}/comment`;

  const response = await fetch(url, {
    method: "POST",
    headers: option,
    body: JSON.stringify({ comment: commentText })
  });

  if (!response.ok) {
    console.log(await response.text());
    return;
  }

  commentInput.value = "";
  getAllComments();
}

commentBtn.addEventListener("click", addComment);

commentInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addComment(e);
});
async function addToFavorite() {
  const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movie/${currentId}/favorite`;
  if (addMyFavoriteBtn.textContent === "-") {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
      body: JSON.stringify({ is_favorite: false }),
    };
    const response = await fetch(url, option);
    if (response.ok) {
      addMyFavoriteBtn.textContent = "+";

    };
    toastr.error("Removed from favorites");


  }
  else {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
      body: JSON.stringify({ is_favorite: true }),
    };
    const response = await fetch(url, option);
    if (response.ok) {
      addMyFavoriteBtn.textContent = "-";
    }
    toastr.success("Added to favorites");
  }
}

addMyFavoriteBtn.addEventListener("click", addToFavorite);


const similarWrapper = document.querySelector(".similarSwiper .swiper-wrapper");

async function getSimiliMovies() {
  const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies`;

  const movieOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, movieOptions);
  if (!response.ok) return;

  const movies = await response.json();
  if (!movies?.result) return;
  const filteredMovieData = movies.data

  const filtData = filteredMovieData
    .map((item) => {
      return `
        <div class="swiper-slide movie-card" onclick="openMovieDetail(${item.id})">
          <img src="${item.cover_url}" alt="${item.title || ""}">
          <div class="card-overlay">
            <p class="category-name">${item.category?.name || "—"}</p>
            <p class="movie-name">${item.title || ""}</p>
          </div>
        </div>
      `;
    })
    .join("");

  similarWrapper.innerHTML = filtData;

  // yeni slideları görsün
  similarSwiper.update();
}

getSimiliMovies();
function openMovieDetail(id) {
  window.location.href = `${location.pathname}?id=${id}`;
}
toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
  timeOut: 1000,        // ✅ 1 saniyə
  extendedTimeOut: 300, // mouse hover edəndə əlavə vaxt
  showDuration: 200,
  hideDuration: 200,
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};