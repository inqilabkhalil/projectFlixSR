let currentId = null;

const modalEl = document.getElementById("deleteModal");
const modal = new bootstrap.Modal(modalEl);

function showDeleteModal(id) {
    currentId = id;
    modal.show();
}

let currentEditId = null;

const editModalEl = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalEl);

function showEditModal(id) {
    currentEditId = id;     // sabah API id gələndə burada olacaq
    editModal.show();
}