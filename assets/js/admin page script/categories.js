// =====================
// PAGINATION STATE
// =====================
let allItems = [];
let currentPage = 1;
let pageSize = 8;

const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfoEl = document.getElementById('pageInfo');

// =====================
// API URLS
// =====================
const BASE_URL = 'https://api.sarkhanrahimli.dev';
const CATEGORY_LIST_URL = `${BASE_URL}/api/filmalisa/admin/categories`;
const CATEGORY_CREATE_URL = `${BASE_URL}/api/filmalisa/admin/category`;
const CATEGORY_DELETE_URL = (id) =>
  `${BASE_URL}/api/filmalisa/admin/category/${id}`;
const CATEGORY_UPDATE_URL = (id) =>
  `${BASE_URL}/api/filmalisa/admin/category/${id}`;

// =====================
// DOM ELEMENTS
// =====================
const modal = document.getElementById('categoryModal');
const form = document.getElementById('categoryForm');
const input = document.getElementById('categoryInput');
const tableBody = document.getElementById('categoryTableBody');
const createBtn = document.querySelector('.create-btn');

// DELETE MODAL
const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
let selectedDeleteId = null;

let mode = 'create';
let editingId = null;

// =====================
// TOKEN
// =====================
function getToken() {
  return localStorage.getItem('access_token');
}

function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    window.location.replace('/Pages/Admin/login.html');
    return true;
  }
  return false;
}

// =====================
// RENDER
// =====================
function renderCategories(categories) {
  tableBody.innerHTML = '';
  const startIndex = (currentPage - 1) * pageSize;

  categories.forEach((category, index) => {
    const row = document.createElement('tr');
    row.dataset.id = category.id;

    row.innerHTML = `
      <th scope="row">${startIndex + index + 1}</th>
      <td>${category.name}</td>
      <td class="operation">
        <i class="fa-solid fa-pen-to-square edit-btn"></i>
        <i class="fa-solid fa-trash delete-btn"></i>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// =====================
// PAGINATION
// =====================
function getTotalPages() {
  return Math.ceil(allItems.length / pageSize) || 1;
}

function renderPage() {
  const totalPages = getTotalPages();

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const pageData = allItems.slice(start, end);
  renderCategories(pageData);

  pageInfoEl.textContent = `${currentPage} / ${totalPages}`;

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

nextPageBtn.addEventListener('click', () => {
  const totalPages = getTotalPages();
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
});

// =====================
// GET
// =====================
async function getCategories({ keepPage = false } = {}) {
  const response = await fetch(CATEGORY_LIST_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (handleUnauthorized(response)) return;

  const result = await response.json();
  if (!response.ok) throw new Error(result?.message || 'GET alınmadı');

  allItems = result.data || [];
  if (!keepPage) currentPage = 1;

  const totalPages = getTotalPages();
  if (currentPage > totalPages) currentPage = totalPages;

  renderPage();
}

// =====================
// CREATE
// =====================
async function createCategory(name) {
  const response = await fetch(CATEGORY_CREATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name }),
  });

  if (handleUnauthorized(response)) return;
  const result = await response.json();
  if (!response.ok) throw new Error(result?.message || 'Create alınmadı');
}

// =====================
// UPDATE
// =====================
async function updateCategory(id, name) {
  const response = await fetch(CATEGORY_UPDATE_URL(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name }),
  });

  if (handleUnauthorized(response)) return;
  const result = await response.json();
  if (!response.ok) throw new Error(result?.message || 'Update alınmadı');
}

// =====================
// DELETE
// =====================
async function deleteCategory(id) {
  const response = await fetch(CATEGORY_DELETE_URL(id), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (handleUnauthorized(response)) return;
  if (!response.ok) throw new Error('Delete alınmadı');
}

// =====================
// DELETE MODAL LOGIC
// =====================
function openDeleteModal(id) {
  selectedDeleteId = id;
  deleteModal.showModal();
}

cancelDeleteBtn.addEventListener('click', () => {
  selectedDeleteId = null;
  deleteModal.close();
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!selectedDeleteId) return;

  try {
    await deleteCategory(selectedDeleteId);
    showToast?.("Category deleted successfully", "success");
    await getCategories({ keepPage: true });
  } catch (err) {
    showToast?.("Delete failed", "error");
  } finally {
    selectedDeleteId = null;
    deleteModal.close();
  }
});

// =====================
// ON LOAD
// =====================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await getCategories();
  } catch (err) {
    alert(err.message);
  }
});

// =====================
// CREATE BUTTON
// =====================
createBtn.addEventListener('click', () => {
  mode = 'create';
  editingId = null;
  input.value = '';
  modal.showModal();
});

// =====================
// FORM SUBMIT
// =====================
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  try {
    if (mode === 'create') {
      await createCategory(value);
      await getCategories({ keepPage: true });
      currentPage = getTotalPages();
      renderPage();
    } else {
      await updateCategory(editingId, value);
      await getCategories({ keepPage: true });
    }

    modal.close();
  } catch (err) {
    alert(err.message || 'Xəta baş verdi');
  }
});

// =====================
// TABLE EVENTS
// =====================
tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row) return;

  const id = row.dataset.id;

  if (e.target.classList.contains('delete-btn')) {
    openDeleteModal(id);
  }

  if (e.target.classList.contains('edit-btn')) {
    mode = 'edit';
    editingId = id;
    input.value = row.children[1].textContent.trim();
    modal.showModal();
  }
});
