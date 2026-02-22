const token = localStorage.getItem("access_token");

const API_LIST = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";
const API_ONE = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor";

const actorTableBody = document.getElementById("actorTableBody");

// modallar
const createActorModal = document.getElementById("createActorModal");
const editActorModal = document.getElementById("editActorModal");
const deleteActorModal = document.getElementById("deleteActorModal");

// formlar
const createActorForm = document.getElementById("createActorForm");
const editActorForm = document.getElementById("editActorForm");

// inputlar
const createName = document.getElementById("createName");
const createSurname = document.getElementById("createSurname");
const editName = document.getElementById("editName");
const editSurname = document.getElementById("editSurname");

// delete btn-lər
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

// create btn
const openCreateModalBtn = document.getElementById("openCreateModalBtn");

// pager
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let currentEditId = null;
let currentDeleteId = null;

// pagination state
let allActors = [];
let page = 1;
const pageSize = 8;

/* ======================
  MODAL FUNCS
====================== */
function openCreateModal() {
  createActorModal.showModal();
}
function openEditModal(id, name, surname) {
  currentEditId = id;
  editName.value = (name || "").trim();
  editSurname.value = (surname || "").trim();
  editActorModal.showModal();
}
function openDeleteModal(id) {
  currentDeleteId = id;
  deleteActorModal.showModal();
}
function closeDeleteModal() {
  currentDeleteId = null;
  deleteActorModal.close();
}

openCreateModalBtn.addEventListener("click", openCreateModal);
cancelDeleteBtn.addEventListener("click", closeDeleteModal);

// inline onclick işləsin deyə
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;

/* ======================
  FETCH
====================== */
async function fetchActors() {
  const res = await fetch(`${API_LIST}?t=${Date.now()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const result = await res.json();

  allActors = result.data || [];
  page = 1;
  renderPage();
}

function renderPage() {
  const totalPages = Math.ceil(allActors.length / pageSize) || 1;
  if (page > totalPages) page = totalPages;
  if (page < 1) page = 1;

  const start = (page - 1) * pageSize;
  const pageItems = allActors.slice(start, start + pageSize);

  actorTableBody.innerHTML = pageItems
    .map(
      (actor) => `
        <tr>
          <th scope="row">${actor.id}</th>
          <td>${actor.name}</td>
          <td>${actor.surname}</td>
          <td class="operation">
            <i class="fa-solid fa-pen-to-square edit-btn"
              onclick="openEditModal(${actor.id}, '${actor.name}', '${actor.surname}')"></i>

            <i class="fa-solid fa-trash delete-btn"
              onclick="openDeleteModal(${actor.id})"></i>
          </td>
        </tr>
      `
    )
    .join("");

  renderPager(totalPages);
}

function renderPager(totalPages) {
  pageInfo.textContent = `${page} / ${totalPages}`;

  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === totalPages;

  prevBtn.onclick = () => {
    page--;
    renderPage();
  };

  nextBtn.onclick = () => {
    page++;
    renderPage();
  };
}

/* ======================
  CREATE
====================== */
async function createActor(e) {
  e.preventDefault();

  const name = createName.value.trim();
  const surname = createSurname.value.trim();
  if (!name || !surname) return;

  await fetch(API_ONE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, surname, img_url: null }),
  });

  createActorForm.reset();
  createActorModal.close();
  await fetchActors();
}
createActorForm.addEventListener("submit", createActor);

/* ======================
  UPDATE
====================== */
async function updateActor(e) {
  e.preventDefault();

  const name = editName.value.trim();
  const surname = editSurname.value.trim();
  if (!name || !surname) return;

  await fetch(`${API_ONE}/${currentEditId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, surname, img_url: null }),
  });

  editActorModal.close();
  currentEditId = null;
  await fetchActors();
}
editActorForm.addEventListener("submit", updateActor);

/* ======================
  DELETE
====================== */
async function deleteActor() {
  if (!currentDeleteId) return;

  await fetch(`${API_ONE}/${currentDeleteId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  closeDeleteModal();
  await fetchActors();
}
confirmDeleteBtn.addEventListener("click", deleteActor);

fetchActors();