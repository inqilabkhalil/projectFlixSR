// =====================
// PAGINATION STATE
// =====================
let allItems = [];
let currentPage = 1;
let pageSize = 8;

// Pagination DOM
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfoEl = document.getElementById('pageInfo');

// =====================
// API URLS
// =====================
const BASE_URL = 'https://api.sarkhanrahimli.dev';
const USER_LIST_URL = `${BASE_URL}/api/filmalisa/admin/users`;
const USER_UPDATE_URL = (id) =>
  `${BASE_URL}/api/filmalisa/admin/user/${id}`;
const USER_DELETE_URL = (id) =>
  `${BASE_URL}/api/filmalisa/admin/user/${id}`;

// =====================
// DOM ELEMENTS
// =====================
const modal = document.getElementById('userEditModal');
const form = document.getElementById('userEditForm');
const input = document.getElementById('userNameInput');
const tableBody = document.getElementById('userTableBody');
const deleteModal = document.getElementById('userDeleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

let editingId = null;
let currentDeleteId = null;

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
function renderUsers(users) {
  tableBody.innerHTML = '';

  if (!users || users.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="3" style="text-align: center; padding: 40px; color: #888;">
        No users
      </td>
    `;
    tableBody.appendChild(row);
    return;
  }

  const startIndex = (currentPage - 1) * pageSize;

  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.dataset.id = user.id;

    const displayName =
      user.full_name || user.name || user.username || user.email || '-';

    row.innerHTML = `
      <th scope="row">${startIndex + index + 1}</th>
      <td>${displayName}</td>
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
  renderUsers(pageData);

  pageInfoEl.textContent = `${currentPage} / ${totalPages}`;

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
// =====================
async function getUsers({ keepPage = false } = {}) {
  const response = await fetch(USER_LIST_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (handleUnauthorized(response)) return;

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || 'GET failed');
  }

  allItems = result.data || [];

  if (!keepPage) currentPage = 1;

  if (keepPage) {
    const totalPages = getTotalPages();
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
  }

  renderPage();
}

// =====================
// PUT
// =====================
async function updateUser(userId, full_name) {
  const response = await fetch(USER_UPDATE_URL(userId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ full_name }),
  });

  if (handleUnauthorized(response)) return;

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || 'Update failed');
  }

  return result;
}

// =====================
// DELETE
// =====================
async function deleteUser(userId) {
  const response = await fetch(USER_DELETE_URL(userId), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (handleUnauthorized(response)) return;

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result?.message || 'Delete failed');
  }

  return result;
}

// =====================
// ON LOAD
// =====================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await getUsers({ keepPage: false });
  } catch (err) {
    allItems = [];
    renderPage();
  }
});

// =====================
// SUBMIT (EDIT)
// =====================
cancelDeleteBtn.addEventListener('click', () => {
  currentDeleteId = null;
  deleteModal.close();
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!currentDeleteId) return;
  try {
    await deleteUser(currentDeleteId);
    currentDeleteId = null;
    deleteModal.close();
    await getUsers({ keepPage: true });
  } catch (err) {
    alert(err.message || 'Delete failed');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value || !editingId) return;

  try {
    await updateUser(editingId, value);
    await getUsers({ keepPage: true });
    input.value = '';
    editingId = null;
    modal.close();
  } catch (err) {
    alert(err.message || 'Update failed');
  }
});

// =====================
// DELETE + EDIT (TABLE)
// =====================
tableBody.addEventListener('click', async (e) => {
  const row = e.target.closest('tr');
  if (!row) return;

  const userId = row.dataset.id;
  if (!userId) return;

  // DELETE
  if (e.target.classList.contains('delete-btn')) {
    currentDeleteId = userId;
    deleteModal.showModal();
  }

  // EDIT
  if (e.target.classList.contains('edit-btn')) {
    editingId = userId;
    input.value = row.children[1].textContent.trim();
    modal.showModal();
  }
});
