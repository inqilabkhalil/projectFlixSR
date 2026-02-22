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
// RENDER
// =====================
function renderCategories(categories) {
  tableBody.innerHTML = '';

  categories.forEach((category, index) => {
    const row = document.createElement('tr');
    row.dataset.id = category.id;

    row.innerHTML = `
      <th scope="row">${index + 1}</th>
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
// GET
// =====================
async function getCategories() {
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

  renderCategories(result.data || []);
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
    await getCategories();
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
// SUBMIT
// =====================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  try {
    if (mode === 'create') {
      await createCategory(value);
    } else {
      if (!editingId) return alert('Edit ID tapılmadı');
      await updateCategory(editingId, value);
    }

    await getCategories();
    input.value = '';
    modal.close();
  } catch (err) {
    alert(err.message || 'Xəta baş verdi');
  }
});

// =====================
// DELETE + EDIT
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
      await getCategories();
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
// son hali
