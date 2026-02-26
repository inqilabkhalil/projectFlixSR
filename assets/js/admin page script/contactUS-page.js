const deleteModalElement = document.getElementById("deleteModal");
const deleteModal = new bootstrap.Modal(deleteModalElement);

let deletedId = null;

const token = localStorage.getItem("access_token");
const tableBody = document.getElementById("contactTableBody");
const confirmDeleteBtn = document.querySelector(".btn-delete-confirm");

const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

/* ======================
   Pagination (8-8)
====================== */
let allContacts = [];
let page = 1;
const pageSize = 8;

function showDeleteModal(id) {
  deleteModal.show();
  deletedId = id;
}

async function getAllContacts() {
  const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/contacts`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    allContacts = result.data;
    page = 1;
    RenderData();
  } catch (error) {
    console.error("Error fetching contacts:", error);
    showToast?.("Failed to load contacts", "error");
  }
}

function RenderData() {
  const totalPages = Math.ceil(allContacts.length / pageSize) || 1;

  if (page > totalPages) page = totalPages;
  if (page < 1) page = 1;

  const start = (page - 1) * pageSize;
  const pageItems = allContacts.slice(start, start + pageSize);

  const rows = pageItems
    .map((item) => {
      return `
        <tr class="table-row">
          <th scope="row">${item.id}</th>
          <td>${item.full_name || "-"}</td>
          <td>${item.email || "-"}</td>
          <td>${item.message || "-"}</td>
          <td class="operation">
            <i 
              class="fa-solid fa-trash"
              onclick="showDeleteModal(${item.id})"
              style="cursor:pointer">
            </i>
          </td>
        </tr>
      `;
    })
    .join("");

  tableBody.innerHTML = rows;

  renderPager(totalPages);
}

function renderPager(totalPages) {
  pageInfo.textContent = `${page} / ${totalPages}`;

  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === totalPages;

  prevBtn.onclick = () => {
    page--;
    RenderData();
  };

  nextBtn.onclick = () => {
    page++;
    RenderData();
  };
}

getAllContacts();

async function deleteContact() {
  const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/contact/${deletedId}`;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      deleteModal.hide();
      showToast?.("Deleted successfully", "success"); // ✅ TOAST
      await getAllContacts();
    } else {
      showToast?.("Delete failed", "error");
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
    showToast?.("Network error", "error");
  }
}

confirmDeleteBtn.addEventListener("click", deleteContact);