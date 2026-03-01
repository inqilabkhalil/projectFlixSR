// ================== PAGINATION STATE ==================
let currentPage = 1;
const pageSize = 10;
let allMovies = [];

// ================== ELEMENTS ==================
const prevPageBtn = document.getElementById("prevPage"); // create eleyende modali bu zamn coverurlimi deyisende modal-img ye coverurlin linkini menimsetmek lazimdi onnu ele ver
const nextPageBtn = document.getElementById("nextPage");
const pageInfoEl = document.getElementById("pageInfo");
const moviesTableBody = document.getElementById("movieTableBody");
const movieForm = document.getElementById("movieForm");

// Inputs
const movieTitle = document.getElementById("movieTitle");
const movieOverview = document.getElementById("movieOverview");
const movieCoverUrl = document.getElementById("movieCoverUrl");
const movieTrailerUrl = document.getElementById("movieTrailerUrl");
const movieWatchUrl = document.getElementById("movieWatchUrl");
const movieImdb = document.getElementById("movieImdb");
const movieRuntime = document.getElementById("movieRuntime");
const adultCheck = document.getElementById("isAdult");

// Cover preview img (modal)
const modalImg = document.getElementById("modal-img");

// Selects
const movieCategory = document.getElementById("categorySelect");
const actorsSelectEl = document.getElementById("actorsSelect");

// Delete modal buttons
const confirmDeleteMovieBtn = document.getElementById("confirmDeleteMovieBtn");

// ================== API URLs ==================
const BASE_URL = "https://api.sarkhanrahimli.dev";
const MOVIES_LIST_URL = `${BASE_URL}/api/filmalisa/admin/movies`;
const MOVIE_CREATE_URL = `${BASE_URL}/api/filmalisa/admin/movie`;
const MOVIE_DELETE_URL = (id) => `${BASE_URL}/api/filmalisa/admin/movie/${id}`;
const MOVIE_UPDATE_URL = (id) => `${BASE_URL}/api/filmalisa/admin/movie/${id}`;
const MOVIE_GETBYID_URL = (id) => `${BASE_URL}/api/filmalisa/admin/movies/${id}`;
const CATEGORIES_LIST_URL = `${BASE_URL}/api/filmalisa/admin/categories`;
const ACTORS_LIST_URL = `${BASE_URL}/api/filmalisa/admin/actors`;

// ================== MODALS ==================
const createMovieModal = new bootstrap.Modal(
  document.getElementById("createMovieModal")
);
const deleteMovieModal = new bootstrap.Modal(
  document.getElementById("deleteMovieModal")
);

// ================== GLOBALS ==================
let currentId = null;
let isEdit = false;
let actorsChoices = null;

// ================== HELPERS ==================
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

function truncate(str = "") {
  return str.length > 30 ? str.substring(0, 30) + "..." : str;
}

/**
 * Debug helper – log non-2xx responses
 */
async function logError(context, response) {
  const text = await response.text().catch(() => "(body okunamadı)");
  console.error(`[${context}] status=${response.status}`, text);
}

// cover preview helper
function updateCoverPreview(url = "") {
  if (!modalImg) return;
  modalImg.src = String(url || "").trim();
}

// ================== CHOICES.JS ==================
function initActorsChoices() {
  if (actorsChoices) return;
  actorsChoices = new Choices(actorsSelectEl, {
    removeItemButton: true,
    shouldSort: false,
    placeholder: true,
    placeholderValue: "Aktoru seç...",
    searchPlaceholderValue: "Axtar...",
  });
}

function getSelectedActorIds() {
  if (!actorsChoices) return [];
  // Choices.getValue(true) → array of value strings
  const vals = actorsChoices.getValue(true);
  return (Array.isArray(vals) ? vals : [vals]).filter(Boolean).map(Number);
}

function resetFormState() {
  movieForm.reset();
  currentId = null;
  isEdit = false;
  if (actorsChoices) actorsChoices.removeActiveItems();
  updateCoverPreview("");
}

//  ================== LOAD CATEGORIES ==================
let categoriesLoaded = false;

async function loadCategories() {
  if (categoriesLoaded) return;
  try {
    const response = await fetch(CATEGORIES_LIST_URL, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      await logError("loadCategories", response);
      return;
    }
    const data = await response.json();
    const categories = data.data || [];
    movieCategory.innerHTML = categories
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join("");
    categoriesLoaded = true;
  } catch (err) {
    console.error("loadCategories error:", err);
  }
}

// ================== LOAD ACTORS ==================
let actorsLoaded = false;

async function loadActors() {
  initActorsChoices();
  if (actorsLoaded) return;
  try {
    const response = await fetch(ACTORS_LIST_URL, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      await logError("loadActors", response);
      return;
    }
    const data = await response.json();
    const actors = data.data || [];
    const choicesData = actors.map((a) => ({
      value: String(a.id),
      label: `${a.name} ${a.surname}`,
    }));
    actorsChoices.clearChoices();
    actorsChoices.setChoices(choicesData, "value", "label", true);
    actorsLoaded = true;
  } catch (err) {
    console.error("loadActors error:", err);
  }
}

//================== FETCH & RENDER MOVIES ==================
async function fetchMovies() {
  const response = await fetch(MOVIES_LIST_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (handleUnauthorized(response)) return null;
  if (!response.ok) {
    await logError("fetchMovies", response);
    return null;
  }
  const data = await response.json();
  return data.data || [];
}

function updatePagination() {
  const totalPages = Math.max(1, Math.ceil(allMovies.length / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;
  pageInfoEl.textContent = `${currentPage} / ${totalPages}`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
}

function renderMoviesTable() {
  const start = (currentPage - 1) * pageSize;
  const pageItems = allMovies.slice(start, start + pageSize);

  moviesTableBody.innerHTML = pageItems
    .map(
      (m) => `<tr>
      <th scope="row">${m.id}</th>
      <td>${m.title ?? ""}</td>
      <td>${truncate(m.overview ?? "")}</td>
      <td>${m.category?.name ?? ""}</td>
      <td>${m.imdb ?? ""}</td>
      <td class="operation">
        <i class="fa-solid fa-pen-to-square edit-btn" onclick="openEditModal(${m.id})"></i>
        <i class="fa-solid fa-trash delete-btn" onclick="openDeleteModal(${m.id})"></i>
      </td>
    </tr>`
    )
    .join("");
}

async function renderMovies() {
  try {
    const movies = await fetchMovies();
    if (!movies) return;
    allMovies = movies;

    await loadCategories();
    await loadActors();

    updatePagination();
    renderMoviesTable();
  } catch (err) {
    console.error("renderMovies error:", err);
  }
}

// ================== OPEN CREATE ==================
function openCreateModal() {
  resetFormState();
  createMovieModal.show();
}

// ================== GET BY ID ==================
async function fetchMovieById(id) {
  const response = await fetch(MOVIE_GETBYID_URL(id), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (handleUnauthorized(response)) return null;
  if (!response.ok) {
    await logError("fetchMovieById", response);
    return null;
  }
  const data = await response.json();
  return data.data;
}

// ================== OPEN EDIT ==================
async function openEditModal(id) {
  try {
    isEdit = true;
    currentId = id;

    await loadCategories();
    await loadActors();

    const movie = await fetchMovieById(id);
    if (!movie) return;

    movieTitle.value = movie.title ?? "";
    movieOverview.value = movie.overview ?? "";
    movieCoverUrl.value = movie.cover_url ?? "";
    updateCoverPreview(movie.cover_url ?? "");
    movieTrailerUrl.value = movie.fragman ?? "";
    movieWatchUrl.value = movie.watch_url ?? "";
    movieImdb.value = movie.imdb ?? "";
    movieRuntime.value = movie.run_time_min ?? "";
    adultCheck.checked = !!movie.adult;

    // category → id
    if (movie.category && movie.category.id != null) {
      movieCategory.value = String(movie.category.id);
    }

    // actors preselect
    const actorIds = (movie.actors || []).map((a) => String(a.id ?? a));
    if (actorsChoices) {
      actorsChoices.removeActiveItems();
      actorIds.forEach((idStr) => actorsChoices.setChoiceByValue(idStr));
    }

    createMovieModal.show();
  } catch (err) {
    console.error("openEditModal error:", err);
  }
}

// ================== OPEN DELETE ==================
function openDeleteModal(id) {
  currentId = id;
  deleteMovieModal.show();
}

// ================== SAVE (CREATE / UPDATE) ==================
async function saveMovie() {
  // build snake_case payload
  const payload = {
    title: movieTitle.value,
    overview: movieOverview.value,
    cover_url: movieCoverUrl.value,
    fragman: movieTrailerUrl.value,
    watch_url: movieWatchUrl.value,
    imdb: movieImdb.value,
    run_time_min: parseInt(movieRuntime.value, 10) || 0,
    category: Number(movieCategory.value),
    adult: adultCheck.checked,
    actors: getSelectedActorIds(),
  };

  console.log("SENDING DATA:", payload);

  const url = isEdit ? MOVIE_UPDATE_URL(currentId) : MOVIE_CREATE_URL;
  const method = isEdit ? "PUT" : "POST";

  try {
    // first attempt — with actors
    let response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (handleUnauthorized(response)) return;

    // If 400 and possibly actors not accepted → retry without actors
    if (response.status === 400) {
      const errorText = await response.text();
      console.warn("[saveMovie] 400 response with actors:", errorText);

      const lower = errorText.toLowerCase();
      if (
        lower.includes("actors") &&
        (lower.includes("not allowed") ||
          lower.includes("unknown") ||
          lower.includes("invalid") ||
          lower.includes("unexpected"))
      ) {
        console.warn("[saveMovie] Retrying without actors field…");
        const { actors, ...payloadWithoutActors } = payload;

        response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payloadWithoutActors),
        });

        if (handleUnauthorized(response)) return;
      }
    }

    if (!response.ok) {
      await logError("saveMovie", response);
      notifyError("Save failed");
      return;
    }

    createMovieModal.hide();
    notifySuccess(isEdit ? "Updated successfully" : "Created successfully");
    await renderMovies();
  } catch (err) {
    console.error("saveMovie error:", err);
    notifyError("Save failed");
  }
}

// ================== DELETE ==================
async function deleteMovie() {
  try {
    const response = await fetch(MOVIE_DELETE_URL(currentId), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (handleUnauthorized(response)) return;
    if (!response.ok) {
      await logError("deleteMovie", response);
      notifyError("Delete failed");
      return;
    }
    deleteMovieModal.hide();
    notifySuccess("Deleted successfully");
    await renderMovies();
  } catch (err) {
    console.error("deleteMovie error:", err);
    notifyError("Delete failed");
  }
}

// ================== EVENTS ==================
window.openCreateModal = openCreateModal;
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;

confirmDeleteMovieBtn?.addEventListener("click", deleteMovie);

movieForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveMovie();
});

// cover url dəyişəndə modal-img yenilə
movieCoverUrl.addEventListener("input", (e) => {
  updateCoverPreview(e.target.value);
});
movieCoverUrl.addEventListener("change", (e) => {
  updateCoverPreview(e.target.value);
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updatePagination();
    renderMoviesTable();
  }
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.max(1, Math.ceil(allMovies.length / pageSize));
  if (currentPage < totalPages) {
    currentPage++;
    updatePagination();
    renderMoviesTable();
  }
});

// ================== INIT ==================
renderMovies();