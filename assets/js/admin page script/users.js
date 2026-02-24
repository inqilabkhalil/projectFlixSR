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

// =====================
// DOM ELEMENTS
// =====================
const tableBody = document.getElementById('userTableBody');

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
      <td colspan="2" style="text-align: center; padding: 40px; color: #888;">
        No users
      </td>
    `;
    tableBody.appendChild(row);
    return;
  }

  const startIndex = (currentPage - 1) * pageSize;

  users.forEach((user, index) => {
    const row = document.createElement('tr');

    const displayName =
      user.full_name || user.name || user.username || user.email || '-';

    row.innerHTML = `
      <th scope="row">${startIndex + index + 1}</th>
      <td>${displayName}</td>
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
