let currentId = null;
let currentMovieId = null;

const modalEl = document.getElementById("deleteModal");
const modal = new bootstrap.Modal(modalEl);

const commentTableBody = document.querySelector(".comment-table-body");
const token = localStorage.getItem("access_token");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

/* ======================
   Pagination (NEW)
====================== */
let allComments = [];
let page = 1;
const pageSize = 8; // ✅ 10-10

function showDeleteModal(movieId, commentId) {
  currentMovieId = movieId;
  currentId = commentId;
  modal.show();
}

// inline onclick işləsin deyə
window.showDeleteModal = showDeleteModal;

async function fetchDatas() {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments",
      options
    );

    const result = await response.json();
    const info = result.data;

    allComments = info;
    page = 1;

    RenderData();
  } catch (error) {
    console.error("Error fetching comments:", error);
    notifyError("Comments loading failed");
  }
}

fetchDatas();

function RenderData() {
  const totalPages = Math.ceil(allComments.length / pageSize) || 1;

  if (page > totalPages) page = totalPages;
  if (page < 1) page = 1;

  const start = (page - 1) * pageSize;
  const pageItems = allComments.slice(start, start + pageSize);

  const filteredData = pageItems
    .map((item) => {
      const formattedDate = new Date(item.created_at).toLocaleDateString(
        "en-GB",
        { day: "2-digit", month: "short", year: "numeric" }
      );

      return `
        <tr class="table-row"> 
          <td class="comment-user">
            <img src="../../assets/img/adminman.svg" alt="user" />
            <span>${item.user.full_name}</span>
          </td>

          <td class="comment-text">${item.comment}</td>

          <td>${item.movie.title}</td>
          <td>${formattedDate}</td>

          <td class="movie-image">
            <img src="${item.movie.cover_url}" alt="movie image" />
          </td>

          <td class="operation">
            <i class="fa-solid fa-trash"
               onclick="showDeleteModal(${item.movie.id}, ${item.id})"></i>
          </td>
        </tr>
      `;
    })
    .join("");

  commentTableBody.innerHTML = filteredData;

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

async function deleteComment() {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${currentMovieId}/comment/${currentId}`,
      options
    );

    if (response.ok) {
      notifySuccess("Comment deleted successfully"); // ✅ TOAST
      modal.hide();
      fetchDatas();
    } else {
      notifyError("Delete failed"); // ✅ TOAST
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    notifyError("Delete failed"); // ✅ TOAST
  }
}

confirmDeleteBtn.addEventListener("click", deleteComment);