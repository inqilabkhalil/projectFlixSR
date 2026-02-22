// =====================
// PAGINATION STATE
// =====================
let allItems = [];
let currentPage = 1;
let pageSize = 8; // ✅ hər səhifə 8 item

// Pagination DOM
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

// Mode
let mode = 'create';
let editingId = null;

// =====================
// TOKEN HELPER
// =====================
function getToken() {
  return localStorage.getItem('access_token');
}

// =====================
// HANDLE 401
// =====================
function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    window.location.replace('/Pages/Admin/login.html');
    return true;
  }
  return false;
}

// =====================
// RENDER TABLE
// =====================
function renderCategories(categories) {
  tableBody.innerHTML = '';

  const startIndex = (currentPage - 1) * pageSize; // ✅ global index üçün

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
// PAGINATION UI + PAGE RENDER
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

  // pager text
  pageInfoEl.textContent = `${currentPage} / ${totalPages}`;

  // disable buttons
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

// Prev / Next
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
// keepPage: true -> edit/delete zamanı səhifə dəyişməsin
// keepPage: false -> normal load (1-ci səhifə)
// =====================
async function getCategories({ keepPage = false } = {}) {
  const response = await fetch(CATEGORY_LIST_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (handleUnauthorized(response)) return;

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || 'GET alınmadı');
  }

  allItems = result.data || [];

  // səhifə davranışı:
  if (!keepPage) currentPage = 1;

  // əgər delete-dən sonra currentPage boş qalarsa (məs: son səhifə boşaldı)
  if (keepPage) {
    const totalPages = getTotalPages();
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
  }

  renderPage();
}

// =====================
// POST
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

  if (!response.ok) {
    throw new Error(result?.message || 'Create alınmadı');
  }

  return result;
}

// =====================
// PUT
// =====================
async function updateCategory(categoryId, name) {
  const response = await fetch(CATEGORY_UPDATE_URL(categoryId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name }),
  });

  if (handleUnauthorized(response)) return;

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || 'Update alınmadı');
  }

  return result;
}

// =====================
// DELETE
// =====================
async function deleteCategory(categoryId) {
  const response = await fetch(CATEGORY_DELETE_URL(categoryId), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (handleUnauthorized(response)) return;

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result?.message || 'Delete alınmadı');
  }

  return result;
}

// =====================
// ON LOAD
// =====================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await getCategories({ keepPage: false }); // ilk açılış -> 1-ci səhifə
  } catch (err) {
    alert(err.message);
  }
});

// =====================
// OPEN CREATE MODAL
// =====================
createBtn.addEventListener('click', () => {
  mode = 'create';
  editingId = null;
  input.value = '';
  modal.showModal();
});

// =====================
// SUBMIT (CREATE / EDIT)
// =====================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  try {
    if (mode === 'create') {
      await createCategory(value);

      // data yenilə
      await getCategories({ keepPage: true });

      // ✅ CREATE zamanı avtomatik SON səhifəyə keç
      currentPage = getTotalPages();
      renderPage();
    } else {
      if (!editingId) return alert('Edit ID tapılmadı');

      await updateCategory(editingId, value);

      // ✅ EDIT zamanı səhifə yerində qalsın
      await getCategories({ keepPage: true });
    }

    input.value = '';
    modal.close();
  } catch (err) {
    alert(err.message || 'Xəta baş verdi');
  }
});

// =====================
// DELETE + EDIT (TABLE)
// =====================
tableBody.addEventListener('click', async (e) => {
  const row = e.target.closest('tr');
  if (!row) return;

  const categoryId = row.dataset.id;
  if (!categoryId) return;

  // DELETE
  if (e.target.classList.contains('delete-btn')) {
    const ok = confirm('Silmək istəyirsən?');
    if (!ok) return;

    try {
      await deleteCategory(categoryId);

      // ✅ DELETE zamanı səhifə yerində qalsın (amma boş qalsa geriyə düşəcək)
      await getCategories({ keepPage: true });
    } catch (err) {
      alert(err.message || 'Delete xətası');
    }
  }

  // EDIT
  if (e.target.classList.contains('edit-btn')) {
    mode = 'edit';
    editingId = categoryId;
    input.value = row.children[1].textContent.trim();
    modal.showModal();
  }
});
