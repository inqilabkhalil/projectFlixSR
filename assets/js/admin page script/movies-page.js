




//   delete modal
document.getElementById('deleteModal').addEventListener('show.bs.modal', function (e) {
    const btn = e.relatedTarget;
    const title = btn.getAttribute('data-title');
    document.getElementById('deleteItemName').textContent = '"' + title + '"';
});



// Edit modal dolu veziyyetde

document.getElementById('contentModal').addEventListener('show.bs.modal', function (e) {
    const btn = e.relatedTarget;
    if (!btn.classList.contains('edit-btn')) return;

    document.getElementById('editTitle').value = btn.dataset.title;
    document.getElementById('editOverview').value = btn.dataset.overview;
    document.getElementById('coverInput').value = btn.dataset.cover;
    document.getElementById('posterImg').src = btn.dataset.cover;
    document.getElementById('editImdb').value = btn.dataset.imdb;

    const cat = btn.dataset.category;
    const select = document.getElementById('catSelect');
    select.value = cat;
    select.classList.add('filled');
});


// reset modal ve create 
 
document.getElementById('contentModal').addEventListener('show.bs.modal', function (e) {
    if (e.relatedTarget.classList.contains('create-btn')) {
        document.querySelectorAll('#contentModal input, #contentModal textarea').forEach(i => i.value = '');
        document.getElementById('posterImg').src = '';
        document.getElementById('catSelect').selectedIndex = 0;
    }
});

