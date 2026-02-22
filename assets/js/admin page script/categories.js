// =====================
// API URLS
// =====================
const BASE_URL = 'https://api.sarkhanrahimli.dev';
const CATEGORY_LIST_URL = `${BASE_URL}/api/filmalisa/admin/categories`; // GET
const CATEGORY_CREATE_URL = `${BASE_URL}/api/filmalisa/admin/category`; // POST
const CATEGORY_DELETE_URL = (id) =>
  `${BASE_URL}/api/filmalisa/admin/category/${id}`; // DELETE
const CATEGORY_UPDATE_URL = (id) =>
  `${BASE_URL}/api/filmalisa/admin/category/${id}`; // PUT (assumed)

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
let editingRow = null;
let editingId = null;

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
  const token = localStorage.getItem('token');

  const response = await fetch(CATEGORY_LIST_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  console.log('GET result:', result);

  if (!response.ok) {
    throw new Error(result?.message || 'GET alınmadı');
  }

  renderCategories(result.data || []);
}

// =====================
// POST
// =====================
async function createCategory(name) {
  const token = localStorage.getItem('token');

  const response = await fetch(CATEGORY_CREATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const result = await response.json();
  console.log('POST result:', result);

  if (!response.ok) {
    throw new Error(result?.message || 'Create alınmadı');
  }

  return result;
}

// =====================
// PUT (UPDATE)
// =====================
async function updateCategory(categoryId, name) {
  const token = localStorage.getItem('token');

  const response = await fetch(CATEGORY_UPDATE_URL(categoryId), {
    method: 'PUT', // bəzən PATCH olur, API-nə görə dəyişə bilər
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const result = await response.json();
  console.log('PUT result:', result);

  if (!response.ok) {
    throw new Error(result?.message || 'Update alınmadı');
  }

  return result;
}

// =====================
// DELETE
// =====================
async function deleteCategory(categoryId) {
  const token = localStorage.getItem('token');

  const response = await fetch(CATEGORY_DELETE_URL(categoryId), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => ({}));
  console.log('DELETE result:', result);

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
    console.error(err);
    alert(err.message);
  }
});

// =====================
// OPEN CREATE MODAL
// =====================
createBtn.addEventListener('click', () => {
  mode = 'create';
  editingRow = null;
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
  if (value === '') return;

  try {
    if (mode === 'create') {
      await createCategory(value);
      await getCategories();
    } else {
      // EDIT -> PUT
      if (!editingId) return alert('Edit ID tapılmadı');

      await updateCategory(editingId, value);
      await getCategories();
    }

    input.value = '';
    modal.close();
  } catch (err) {
    console.error(err);
    alert(err.message || 'Xəta baş verdi');
  }
});

// =====================
// DELETE + EDIT
// =====================
tableBody.addEventListener('click', async (e) => {
  // DELETE
  if (e.target.classList.contains('delete-btn')) {
    const row = e.target.closest('tr');
    const categoryId = row?.dataset?.id;

    if (!categoryId) return alert('ID tapılmadı');

    const ok = confirm('Silmək istəyirsən?');
    if (!ok) return;

    try {
      await deleteCategory(categoryId);
      await getCategories();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Delete xətası!');
    }
  }

  // EDIT
  if (e.target.classList.contains('edit-btn')) {
    const row = e.target.closest('tr');

    mode = 'edit';
    editingRow = row;
    editingId = row?.dataset?.id;

    if (!editingId) return alert('Edit ID tapılmadı');

    input.value = row.children[1].textContent.trim();
    modal.showModal();
  }
});
