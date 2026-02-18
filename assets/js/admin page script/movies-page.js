


const deleteModalElement = document.getElementById('deleteModal')
const deleteModal = new bootstrap.Modal(deleteModalElement)

currentEditId = null;

function showDeleteModal(id){
    currentEditId = id;
    deleteModal.show()
}

const editModalElement = document.getElementById('editModal');
const editModal = new bootstrap.Modal(editModalElement);

function showEditModal(id) {
  currentEditId = id;
  editModal.show();
}
