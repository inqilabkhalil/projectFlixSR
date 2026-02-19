let currentId = null;
let currentMovieId = null;
const modalEl = document.getElementById("deleteModal");
const modal = new bootstrap.Modal(modalEl);
const commentTableBody = document.querySelector(".comment-table-body");
const token = localStorage.getItem("access_token");

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

function showDeleteModal(movieId, commentId) {
    currentMovieId = movieId;
    currentId = commentId;
    modal.show();
}
async function fetchDatas() {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await fetch("https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments", options);
        const data = await response.json();
        RenderData(data)
    }
    catch (error) {
        console.error("Error fetching comments:", error);
    }
}

fetchDatas();

function RenderData(obj) {
    console.log(obj);

    const filteredData = obj.data.map(item => {
         const formattedDate = new Date(item.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
        return(`   <tr class="table-row"> 
        <td class="comment-user">
                    <img src="../../assets/img/adminman.svg" alt="user" />
                    <span>${item.user.full_name}</span>
                  </td>

                  <td class="comment-text">
                    ${item.comment}
                  </td>

                  <td>${item.movie.title}</td>
                  <td>${formattedDate}</td>
                  <td class="movie-image">
                    <img src="${item.movie.cover_url}" alt="movie image"  />
                  </td>

                  <td class="operation">
                    
                    <i
                      class="fa-solid fa-trash"
                 onclick="showDeleteModal(${item.movie.id}, ${item.id})"
                    ></i>
                  </td>
                </tr>`)
    }).join("");
    commentTableBody.innerHTML = filteredData;
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
        const response = await fetch(`https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${currentMovieId}/comment/${currentId}`, options);
       if(response.ok){
        fetchDatas();
        modal.hide();
       }}
       catch (error) {
        console.error("Error deleting comment:", error);
    }
}
confirmDeleteBtn.addEventListener("click", deleteComment);