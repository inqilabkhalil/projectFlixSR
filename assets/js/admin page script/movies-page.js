

const createBtn = document.querySelector('.create-btn');
const createMovieModal = new bootstrap.Modal(document.getElementById('createMovieModal'));
const deleteMovieModal = new bootstrap.Modal(document.getElementById('deleteMovieModal'));
const editBtn = document.querySelector('.edit-btn');
const deleteBtn = document.querySelector('.delete-btn');
createBtn.addEventListener('click', () => {
    createMovieModal.show();
});

editBtn.addEventListener('click', () => {
    createMovieModal.show();
});

deleteBtn.addEventListener('click', () => {
    deleteMovieModal.show();
});
