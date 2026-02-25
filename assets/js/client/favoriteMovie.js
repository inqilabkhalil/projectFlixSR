const token = localStorage.getItem("client_token");


const favoriteWrapper = document.getElementById("favoriteWrapper");

async function getFavoriteMovies() {
    try {
        const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites`;

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, options);
        const result = await response.json();

        if (!result.result) {
            favoriteWrapper.innerHTML = `<p style="padding:16px;">Favorite tapılmadı</p>`;
            return;
        }

        const favoriteMoviesHTML = result.data
            .map((movie) => {
                const categoryName = movie?.category?.name ?? "Unknown";

                return `
      <article class="comedy-card favorite-card"
               onclick="goToDetail(${movie.id})"
               style="cursor:pointer;">

        <img src="${movie.cover_url}" alt="${movie.title}" />

        <div class="favorite-card-info">

          <p class="category-name">
            ${categoryName}
          </p>

          <div class="movie-rating">
            ⭐ ${movie.imdb ?? "-"}
          </div>

          <h3 class="movie-name">
            ${movie.title}
          </h3>

        </div>
      </article>
    `;
            })
            .join("");

        favoriteWrapper.innerHTML = favoriteMoviesHTML;

        favoriteWrapper.innerHTML = favoriteMoviesHTML;
    } catch (error) {
        console.error(error);
    }
}

getFavoriteMovies();
function goToDetail(id) {
  window.location.href = `./detail.html?id=${id}`;
}