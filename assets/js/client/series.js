const ENDPOINT_MOVIES = 'https://api.sarkhanrahimli.dev/api/filmalisa/movies';
function goToDetail(id) {
  window.location.href = `./detail.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  const movieContainer = document.querySelector('.movie-container');

  let allMovies = [];

  // ================= API =================

  async function fetchMovies() {
    try {
      const token = localStorage.getItem('client_token');
      if (!token) {
        window.location.href = './login.html';
        return [];
      }

      const res = await fetch(ENDPOINT_MOVIES, {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (!res.ok) throw new Error('Fetch failed');

      const result = await res.json();
      return result?.data || [];
    } catch (err) {
      console.error('Fetch error:', err);
      return [];
    }
  }

  // ================= CARD CREATE =================

  function createMovieCard(movie) {
    const imdbValue = Number(movie?.imdb);
    const imdbText = isNaN(imdbValue) ? 'N/A' : imdbValue.toFixed(1);
    

    return `
      <div class="movie-card" onclick="goToDetail(${movie?.id})" style="cursor:pointer;" >
        <img src="${movie?.cover_url}" 
             alt="${movie?.title}" 
             class="movie-poster" />
        <div class="movie-info">
          <div class="movie-informations">
            <div class="movie-category-container">
              <span class="movie-category">
                ${movie?.category.name}
              </span>
            </div>

            <div class="movie-rating">
              <i class="fa-solid fa-star"></i> ${imdbText}
            </div>

            <h3 class="movie-title">${movie?.title}</h3>
          </div>
        </div>
      </div>
    `;
  }

  // ================= SEARCH FUNCTION =================

  function searchMovies(query) {
    const normalizedQuery = query.toLowerCase().trim();

    const filtered = allMovies.filter((movie) => {
      const title = movie?.title?.toLowerCase() || '';
      const overview = movie?.overview?.toLowerCase() || '';

      return (
        title.includes(normalizedQuery) || overview.includes(normalizedQuery)
      );
    });

    renderMovies(filtered);
  }

  // ================= RENDER =================

  function renderMovies(movies) {
    movieContainer.innerHTML = '';

    if (!movies.length) {
      movieContainer.innerHTML =
        "<p style='color:#fff'>Heç bir nəticə tapılmadı.</p>";
      return;
    }

    movies.forEach((movie) => {
      movieContainer.innerHTML += createMovieCard(movie);
    });
  }

  // ================= BUTTON CLICK =================

  searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    searchMovies(query);
  });

  // ================= INIT =================

  (async function init() {
    allMovies = await fetchMovies();
    renderMovies(allMovies); // səhifə açılarkən hamısını göstər
  })();
});
