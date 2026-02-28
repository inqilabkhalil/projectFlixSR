//pagination state
let currentPage = 1;
const pageSize = 10;
let allMovies = [];

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfoEl = document.getElementById("pageInfo");

// API URLs
const BASE_URL = "https://api.sarkhanrahimli.dev";
const MOVIES_LIST_URL = `${BASE_URL}/api/filmalisa/admin/movies`;
const MOVIE_CREATE_URL = `${BASE_URL}/api/filmalisa/admin/movie`;
const MOVIE_DELETE_URL = (id) => `${BASE_URL}/api/filmalisa/admin/movie/${id}`;
const MOVIE_UPDATE_URL = (id) => `${BASE_URL}/api/filmalisa/admin/movie/${id}`;
const CATEGORIES_LIST_URL = `${BASE_URL}/api/filmalisa/admin/categories`;
const ACTORS_LIST_URL = `${BASE_URL}/api/filmalisa/admin/actors`;

// Modal + form (HTML-də var)
const createMovieModal = new bootstrap.Modal(
  document.getElementById("createMovieModal"),
);
const deleteMovieModal = new bootstrap.Modal(
  document.getElementById("deleteMovieModal"),
);

const movieForm = document.getElementById("movieForm");

// Inputs (HTML-də var)
const movieTitle = document.getElementById("movieTitle");
const movieOverview = document.getElementById("movieOverview");
const movieCoverUrl = document.getElementById("movieCoverUrl");
const movieTrailerUrl = document.getElementById("movieTrailerUrl");
const movieWatchUrl = document.getElementById("movieWatchUrl");
const movieImdb = document.getElementById("movieImdb");
const movieRuntime = document.getElementById("movieRuntime");
const modalImg = document.getElementById("modal-img");
const adultCheck = document.getElementById("isAdult");
// Select (HTML-də id="movieCategory")
const movieCategory = document.getElementById("categorySelect");

// Actors select and list elements (HTML-də id="actorsSelect" və id="actorsList")
const actorsListContainer = document.getElementById("actorsSelect");

// Table body (HTML-də id="movieTableBody")
const moviesTableBody = document.getElementById("movieTableBody");

// Create button (HTML-də class="create-btn")
const createMovieBtn = document.querySelector(".create-btn");

// Delete modal buttons (HTML-də var)
const cancelDeleteMovieBtn = document.getElementById("cancelDeleteMovieBtn");
const confirmDeleteMovieBtn = document.getElementById("confirmDeleteMovieBtn");

let currentId = null; // for edit and delete
let isEdit = false; // "create" or "edit"

function getToken() {
  return localStorage.getItem("access_token");
}

function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.replace("/pages/admin/login.html");
    return true;
  }
  return false;
}
function turnate(str) {
  if (str.length > 30) {
    return str.substring(0, 30) + "...";
  }
  return str;
}
async function renderMovies() {
  try {
    const response = await fetch(MOVIES_LIST_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    console.log("Fetched movies:", data);
    allMovies = data.data;
    console.log("All movies array:", allMovies);
    const content = allMovies
      .map((movie) => {
        return `<tr>
              <th scope="row">${movie.id}</th>
              <td>${movie.title}</td>
              <td>${turnate(movie.overview)}</td>
              <td>${movie.category.name}</td>
              <td>${movie.imdb}</td>
              <td class="operation">
                <i class="fa-solid fa-pen-to-square edit-btn" onclick="openEditModal(${movie.id})"></i>
                <i class="fa-solid fa-trash delete-btn" onclick="openDeleteModal(${movie.id})"></i>
              </td>
            </tr>`;
      })
      .join("");
    moviesTableBody.innerHTML = content;

    await loadCategories();
    await loadActors();
    updatePagination();
  } catch (error) {
    console.error("Error fetching movies:", error);
    alert("An error occurred while fetching movies. Please try again later.");
  }
}

function updatePagination() {
  const totalPages = Math.ceil(allMovies.length / pageSize);
  pageInfoEl.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

async function loadCategories() {
  try {
    const Options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    const response = await fetch(CATEGORIES_LIST_URL, Options);
    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    const categories = data.data;
    movieCategory.innerHTML = categories
      .map(
        (category) =>
          `<option value="${category.id}">${category.name}</option>`,
      )
      .join("");
  } catch (error) {
    console.error("Error fetching categories:", error);
    alert(
      "An error occurred while fetching categories. Please try again later.",
    );
  }
}

async function loadActors() {
  try {
    const Options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    const response = await fetch(ACTORS_LIST_URL, Options);
    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      throw new Error("Failed to fetch actors");
    }
    const data = await response.json();
    const actors = data.data;
    const content = actors
      .map(
        (actor) =>
          `<div><input type="checkbox" value="${actor.id}" /> ${actor.name} ${actor.surname}</div>`,
      )
      .join("");
    actorsListContainer.innerHTML = content;
  } catch (error) {
    console.error("Error fetching actors:", error);
    alert("An error occurred while fetching actors. Please try again later.");
  }
}

function openCreateModal() {
  isEdit = false;
  movieForm.reset();
  createMovieModal.show();
}

function openEditModal(id) {
  isEdit = true;
  const movie = allMovies.find((m) => m.id === id);
  if (movie) {
    currentId = id;
    movieTitle.value = movie.title;
    movieOverview.value = movie.overview;
    movieCoverUrl.value = movie.cover_url;
    movieTrailerUrl.value = movie.fragman;
    movieWatchUrl.value = movie.watch_url;
    movieImdb.value = movie.imdb;
    movieRuntime.value = movie.run_time_min;
    movieCategory.value = movie.category;
    createMovieModal.show();
  }
}

function openDeleteModal(id) {
  currentId = id;
  deleteMovieModal.show();
}

async function saveMovie() {
  const movieData = {
    title: movieTitle.value,
    overview: movieOverview.value,
    coverUrl: movieCoverUrl.value,
    trailerUrl: movieTrailerUrl.value,
    watchUrl: movieWatchUrl.value,
    imdb: parseFloat(movieImdb.value),
    runtime: parseInt(movieRuntime.value),
    category: movieCategory.value,
  };
  if (isEdit) {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(movieData),
    };
    try {
      const response = await fetch(`${MOVIE_UPDATE_URL(currentId)}`, options);
      if (handleUnauthorized(response)) return;
      if (!response.ok) {
        throw new Error("Failed to update movie");
      }
      createMovieModal.hide();
      renderMovies();
    } catch (error) {
      console.error("Error updating movie:", error);
      alert(
        "An error occurred while updating the movie. Please try again later.",
      );
    }
  } else {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(movieData),
    };

    try {
      const response = await fetch(MOVIE_CREATE_URL, options);
      if (handleUnauthorized(response)) return;
      if (!response.ok) {
        throw new Error("Failed to create movie");
      }
      createMovieModal.hide();
      renderMovies();
    } catch (error) {
      console.error("Error creating movie:", error);
      alert(
        "An error occurred while creating the movie. Please try again later.",
      );
    }
  }
}

async function deleteMovie() {
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  try {
    const response = await fetch(MOVIE_DELETE_URL(currentId), options);
    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }
    deleteMovieModal.hide();
    renderMovies();
  } catch (error) {
    console.error("Error deleting movie:", error);
    alert(
      "An error occurred while deleting the movie. Please try again later.",
    );
  }
}

confirmDeleteMovieBtn.addEventListener("click", deleteMovie);
movieForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveMovie();
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderMovies();
  }
});
nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(allMovies.length / pageSize);
  if (currentPage < totalPages) {
    currentPage++;
    renderMovies();
  }
});
renderMovies();
