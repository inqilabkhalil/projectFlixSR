const ENDPOINT_MOVIES = 'https://api.sarkhanrahimli.dev/api/filmalisa/movies';

document.addEventListener('DOMContentLoaded', () => {
  const heroCarousel = document.getElementById('heroCarousel');
  const heroDots = document.getElementById('heroDots');
  const actionWrapper = document.getElementById('actionWrapper');
  const comedyWrapper = document.getElementById('comedyWrapper');

  let slides = [];
  let dotButtons = [];
  let activeIndex = 0;
  let sliderInterval = null;

  // ================= UTILS =================

  function extractIframeSrc(html) {
    if (!html) return null;
    const match = html.match(/src\s*=\s*["']([^"']+)["']/i);
    return match ? match[1] : null;
  }

  function openTrailer(movie) {
    const url = movie?.watch_url || extractIframeSrc(movie?.fragman);

    if (url) window.open(url, '_blank');
    else alert('Link tapılmadı.');
  }

  // ================= API =================

  async function fetchMovies() {
    try {
      const token = localStorage.getItem('client_token');
      if (!token) {
        console.warn('client_token tapılmadı.');
        return [];
      }

      const res = await fetch(ENDPOINT_MOVIES, {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (!res.ok) throw new Error('Fetch failed: ' + res.status);

      const result = await res.json();
      return result?.data || [];
    } catch (err) {
      console.error('Fetch error:', err);
      return [];
    }
  }

  // ================= SLIDER =================

  function setActiveSlide(index) {
    if (!slides.length) return;

    slides[activeIndex]?.classList.remove('active');
    dotButtons[activeIndex]?.classList.remove('active');

    activeIndex = index;

    slides[activeIndex]?.classList.add('active');
    dotButtons[activeIndex]?.classList.add('active');
  }

  function nextSlide() {
    setActiveSlide((activeIndex + 1) % slides.length);
  }

  function startAutoSlide() {
    if (sliderInterval) clearInterval(sliderInterval);
    if (slides.length <= 1) return;
    sliderInterval = setInterval(nextSlide, 3500);
  }

  function renderHero(movies) {
    heroCarousel.innerHTML = '';
    heroDots.innerHTML = '';

    const heroMovies = movies.slice(0, 3); // 🔥 3 carousel

    heroMovies.forEach((movie, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' active' : '');

      const img = document.createElement('img');
      img.src = movie?.cover_url;
      img.alt = movie?.title;

      const btn = document.createElement('button');
      btn.className = 'watch-btn';
      btn.textContent = 'Watch now';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTrailer(movie);
      });

      slide.append(img, btn);
      heroCarousel.appendChild(slide);

      const dotBtn = document.createElement('button');
      if (i === 0) dotBtn.classList.add('active');
      dotBtn.addEventListener('click', () => setActiveSlide(i));
      heroDots.appendChild(dotBtn);
    });

    slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
    dotButtons = Array.from(heroDots.querySelectorAll('button'));
    activeIndex = 0;

    startAutoSlide();
  }

  // ================= CARD =================
function goToDetail(id) {
  window.location.href = `./detail.html?id=${id}`;
}
  function createCard(movie, cardClass) {
    const article = document.createElement('article');
    article.className = cardClass;

    const img = document.createElement('img');
    img.src = movie?.cover_url;
    img.alt = movie?.title;

    const cat = document.createElement('span');
    cat.className = 'category-name';
    cat.textContent = movie ?.category?.name || 'Unknown';

    const title = document.createElement('h3');
    title.className = 'movie-name';
    title.textContent = movie?.title;

    // ⭐ IMDB RATING
    const rating = document.createElement('div');
    rating.className = 'movie-rating';

    const imdbValue = Number(movie?.imdb);

    rating.innerHTML = `
      <i class="fa-solid fa-star"></i>
      <span>${isNaN(imdbValue) ? 'N/A' : imdbValue.toFixed(1)}</span>
    `;

    article.append(img, cat, title, rating);

    article.addEventListener('click', () => goToDetail(movie?.id));

    return article;
  }

  function renderSections(movies) {
    actionWrapper.innerHTML = '';
    comedyWrapper.innerHTML = '';

    const actionMovies = movies.slice(0, 10);
    let comedyMovies = movies.slice(10);

    if (comedyMovies.length === 0) {
      comedyMovies = movies.slice(0, 5);
    }

    actionMovies.forEach((m) =>
      actionWrapper.appendChild(createCard(m, 'action-card')),
    );

    comedyMovies.forEach((m) =>
      comedyWrapper.appendChild(createCard(m, 'comedy-card')),
    );
  }

  // ================= INIT =================

  (async function initHome() {
    const movies = await fetchMovies();
    console.log('Movies count:', movies.length);

    if (!movies.length) return;

    renderHero(movies);
    renderSections(movies);
  })();
});
