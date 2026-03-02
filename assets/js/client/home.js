// =============================================
//  HOME PAGE - Film listesi ve carousel
// =============================================

var API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";

// ---- DOM Elementleri ----
var heroCarousel = document.getElementById("heroCarousel");
var heroDots = document.getElementById("heroDots");
var genreSections = document.getElementById("genreSections");

// Trailer modal elementleri
var trailerModal = document.getElementById("trailerModal");
var trailerIframe = document.getElementById("trailerIframe");
var trailerClose = document.getElementById("trailerClose");
var trailerOverlay = document.getElementById("trailerOverlay");

// Slider ucun deyisenler
var slides = [];
var dotButtons = [];
var activeIndex = 0;
var sliderInterval = null;


// =============================================
//  YARDIMCI FUNKSIYALAR
// =============================================

// iframe HTML-inden src linkini cixarir
// meselen: '<iframe src="https://youtube.com/...">' => 'https://youtube.com/...'
function getIframeSrc(html) {
  if (!html) return null;
  var match = html.match(/src\s*=\s*["']([^"']+)["']/i);
  if (match) {
    return match[1];
  }
  return null;
}

// Filmin trailer linkini tapir
function getTrailerUrl(movie) {
  if (!movie) return null;

  var raw = movie.fragman || movie.watch_url || "";

  // Eger iframe HTML-dirise, icinden src-ni cixar
  if (raw.includes("<iframe")) {
    return getIframeSrc(raw);
  }

  return raw || null;
}

// YouTube linkini embed formatina cevirir
// meselen: 'https://youtube.com/watch?v=abc123' => 'https://youtube.com/embed/abc123?autoplay=1'
function makeEmbedUrl(url) {
  if (!url) return "";

  // youtube.com/watch?v=VIDEO_ID ve ya youtu.be/VIDEO_ID formatini yoxla
  var match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/);

  if (match) {
    return "https://www.youtube.com/embed/" + match[1] + "?autoplay=1";
  }

  // Artiq embed formatindadirsa
  if (url.includes("youtube.com/embed")) {
    if (url.includes("autoplay")) return url;
    return url + "?autoplay=1";
  }

  return url;
}

// Detail sehifesine yonlendirir
function goToDetail(id) {
  window.location.href = "./detail.html?id=" + id;
}


// =============================================
//  TRAILER MODAL
// =============================================

// Trailer modalini acir
function openTrailerModal(movie) {
  var url = getTrailerUrl(movie);

  // Trailer yoxdursa, detail sehifesine get
  if (!url) {
    goToDetail(movie.id);
    return;
  }

  trailerIframe.src = makeEmbedUrl(url);
  trailerModal.classList.add("active");
  document.body.style.overflow = "hidden"; // Scroll-u bagla
}

// Trailer modalini bagla
function closeTrailerModal() {
  trailerModal.classList.remove("active");
  trailerIframe.src = ""; // Videonu dayandirmaq ucun src-ni sifirla
  document.body.style.overflow = ""; // Scroll-u ac
}

// Modal baglanma eventleri
trailerClose.addEventListener("click", closeTrailerModal);
trailerOverlay.addEventListener("click", closeTrailerModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeTrailerModal();
  }
});


// =============================================
//  API - Filmleri cek
// =============================================

async function fetchMovies() {
  try {
    var token = localStorage.getItem("client_token");

    if (!token) {
      console.warn("client_token tapilmadi.");
      return [];
    }

    var response = await fetch(API_URL, {
      headers: { Authorization: "Bearer " + token },
    });

    if (!response.ok) {
      console.error("API xetasi:", response.status);
      return [];
    }

    var result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Fetch xetasi:", error);
    return [];
  }
}


// =============================================
//  HERO SLIDER (Carousel)
// =============================================

// Aktiv slayd-i deyisdir
function setActiveSlide(index) {
  if (slides.length === 0) return;

  // Kohne aktiv slaydi sondur
  slides[activeIndex].classList.remove("active");
  dotButtons[activeIndex].classList.remove("active");

  // Yenisini aktiv et
  activeIndex = index;
  slides[activeIndex].classList.add("active");
  dotButtons[activeIndex].classList.add("active");
}

// Novbeti slayda kec
function nextSlide() {
  var nextIndex = (activeIndex + 1) % slides.length;
  setActiveSlide(nextIndex);
}

// Avtomatik slider basla (3.5 saniye)
function startAutoSlide() {
  if (sliderInterval) clearInterval(sliderInterval);
  if (slides.length <= 1) return;
  sliderInterval = setInterval(nextSlide, 3500);
}

// Hero carousel-i renderle
function renderHero(movies) {
  heroCarousel.innerHTML = "";
  heroDots.innerHTML = "";

  // Ilk 3 filmi carousel ucun gotur
  var heroMovies = movies.slice(0, 3);

  heroMovies.forEach(function (movie, i) {
    // ----- Slayd -----
    var slide = document.createElement("div");
    slide.className = "hero-slide";
    if (i === 0) slide.className += " active";

    // Sekil
    var img = document.createElement("img");
    img.src = movie.cover_url || "";
    img.alt = movie.title || "";

    // Watch now butonu
    var btn = document.createElement("button");
    btn.className = "watch-btn";
    btn.textContent = "Watch now";
    btn.dataset.movieIndex = i; // index-i saxla

    // Info bloku
    var info = document.createElement("div");
    info.className = "hero-info";

    var title = document.createElement("h2");
    title.className = "hero-title";
    title.textContent = movie.title || "No title";

    var imdbValue = Number(movie.imdb);
    var rating = document.createElement("div");
    rating.className = "hero-rating";
    rating.innerHTML =
      '<i class="fa-solid fa-star"></i> ' +
      '<span>' + (isNaN(imdbValue) ? "N/A" : imdbValue.toFixed(1)) + '</span>';

    var desc = document.createElement("p");
    desc.className = "hero-desc";
    desc.textContent = movie.overview || movie.description || "Aciqlama movcud deyil.";

    info.appendChild(title);
    info.appendChild(rating);
    info.appendChild(desc);

    slide.appendChild(img);
    slide.appendChild(info);
    slide.appendChild(btn);
    heroCarousel.appendChild(slide);

    // ----- Dot butonu -----
    var dotBtn = document.createElement("button");
    if (i === 0) dotBtn.classList.add("active");
    dotBtn.dataset.slideIndex = i;
    heroDots.appendChild(dotBtn);
  });

  // Watch now butonlarina click eventi
  var watchButtons = heroCarousel.querySelectorAll(".watch-btn");
  watchButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var idx = Number(this.dataset.movieIndex);
      openTrailerModal(heroMovies[idx]);
    });
  });

  // Dot butonlarina click eventi
  var allDots = heroDots.querySelectorAll("button");
  allDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      var idx = Number(this.dataset.slideIndex);
      setActiveSlide(idx);
    });
  });

  // Slayd ve dot massivlerini yenile
  slides = Array.from(heroCarousel.querySelectorAll(".hero-slide"));
  dotButtons = Array.from(heroDots.querySelectorAll("button"));
  activeIndex = 0;

  startAutoSlide();
}


// =============================================
//  MOVIE CARD - Bir kartı yaratma funksiyasi
// =============================================

function createMovieCard(movie) {
  // Ana kart elementi
  var card = document.createElement("article");
  card.className = "movie-card";

  // Poster sekil
  var img = document.createElement("img");
  img.className = "movie-card__poster";
  img.src = movie.cover_url || "";
  img.alt = movie.title || "";
  img.loading = "lazy";

  // Qaranlig gradient overlay
  var overlay = document.createElement("div");
  overlay.className = "movie-card__overlay";

  // Meta sira (janr badge + IMDB rating)
  var metaRow = document.createElement("div");
  metaRow.className = "movie-card__meta";

  // Janr badge
  var badge = document.createElement("span");
  badge.className = "movie-card__badge";
  badge.textContent = movie.category ? movie.category.name : "Other";

  // IMDB rating
  var imdbValue = Number(movie.imdb);
  var ratingText = isNaN(imdbValue) ? "N/A" : imdbValue.toFixed(1);

  var rating = document.createElement("div");
  rating.className = "movie-card__rating";
  rating.innerHTML =
    '<i class="fa-solid fa-star"></i> ' +
    '<span>' + ratingText + '</span>';

  metaRow.appendChild(badge);
  metaRow.appendChild(rating);

  // Film adi
  var title = document.createElement("h3");
  title.className = "movie-card__title";
  title.textContent = movie.title || "No title";

  // Hamisi karti yigir
  card.appendChild(img);
  card.appendChild(overlay);
  card.appendChild(title);
  card.appendChild(metaRow);

  // ----- Trailer preview (hover zamani gorsensin) -----
  var trailerUrl = getTrailerUrl(movie);
  var trailerBox = null;

  if (trailerUrl) {
    trailerBox = document.createElement("div");
    trailerBox.className = "movie-card__trailer";
    trailerBox.dataset.src = makeEmbedUrl(trailerUrl);
    card.appendChild(trailerBox);
  }

  // Hover eventi - uzerin geldikde trailer gosterilir
  var hoverTimer = null;

  card.addEventListener("mouseenter", function () {
    if (!trailerBox) return;

    hoverTimer = setTimeout(function () {
      // Eger iframe yoxdursa, yarat
      if (!trailerBox.querySelector("iframe")) {
        var iframe = document.createElement("iframe");
        iframe.src = trailerBox.dataset.src;
        iframe.allow = "autoplay; encrypted-media";
        iframe.allowFullscreen = true;
        iframe.setAttribute("frameborder", "0");
        trailerBox.appendChild(iframe);
      }
      trailerBox.classList.add("active");
    }, 600); // 600ms gozle
  });

  card.addEventListener("mouseleave", function () {
    clearTimeout(hoverTimer);
    if (!trailerBox) return;

    trailerBox.classList.remove("active");

    // Videonu dayandirmaq ucun iframe-i sil
    var iframe = trailerBox.querySelector("iframe");
    if (iframe) iframe.remove();
  });

  // Karta click => detail sehifesine get
  card.addEventListener("click", function () {
    goToDetail(movie.id);
  });

  return card;
}


// =============================================
//  JANR UZRE QRUPLASDIRMA
// =============================================

// Filmleri janr/kateqoriyaya gore qruplasdirma
// Meselen: { "Action": [film1, film2], "Comedy": [film3], ... }
function groupMoviesByGenre(movies) {
  var grouped = {};

  movies.forEach(function (movie) {
    var genre = movie.category ? movie.category.name : "Other";

    // Bu janr hele yoxdursa, yeni massiv yarat
    if (!grouped[genre]) {
      grouped[genre] = [];
    }

    grouped[genre].push(movie);
  });

  return grouped;
}


// =============================================
//  SEKSIYALARI RENDERLE
// =============================================

// Her janr ucun ayri seksiya yaradir ve sehifeye elave edir
// Janrlar film sayina gore AZALAN sirada sirlanir (en cox film olan janr birinci)
function renderGenreSections(grouped) {
  genreSections.innerHTML = "";

  // Janrlari film sayina gore azalan sirada sirala
  var sortedGenres = Object.entries(grouped)
    .filter(function (entry) { return entry[1].length > 0; })
    .sort(function (a, b) { return b[1].length - a[1].length; });

  sortedGenres.forEach(function (entry) {
    var genreName = entry[0];
    var movies = entry[1];

    // ----- Section -----
    var section = document.createElement("section");
    section.className = "section section--genre";

    // Bashliq
    var header = document.createElement("div");
    header.className = "section__header";

    var h2 = document.createElement("h2");
    h2.className = "section__title";
    h2.innerHTML = genreName + ' <span class="section__chevron">&gt;</span>';

    header.appendChild(h2);
    section.appendChild(header);

    // Kartlar wrapperi (horizontal scroll)
    var wrapper = document.createElement("div");
    wrapper.className = "genre__wrapper";

    // Her filmi kart olaraq elave et
    movies.forEach(function (movie) {
      var card = createMovieCard(movie);
      wrapper.appendChild(card);
    });

    section.appendChild(wrapper);
    genreSections.appendChild(section);
  });
}


// =============================================
//  SEHIFE YUKLENENDE ISLEYIR
// =============================================

async function initHome() {
  // 1) API-den butun filmleri bir defe cek
  var movies = await fetchMovies();

  // Eger film yoxdursa
  if (movies.length === 0) {
    genreSections.innerHTML =
      '<p class="genre__empty" style="margin-left:70px;margin-top:30px;">Film tapilmadi.</p>';
    return;
  }

  // 2) Hero carousel-i renderle (ilk 3 film)
  renderHero(movies);

  // 3) Filmleri janra gore qruplasdirma
  var grouped = groupMoviesByGenre(movies);

  // 4) Her janr ucun seksiya yarat
  renderGenreSections(grouped);
}

// Sehife yuklenende basla
initHome();
