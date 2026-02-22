const createModal = document.getElementById('createActorModal');
const createForm = document.getElementById('createActorForm');
const createInput = document.getElementById('createActorInput');

const editModal = document.getElementById('editActorModal');
const editForm = document.getElementById('editActorForm');
const editInput = document.getElementById('editActorInput');

const tableBody = document.getElementById('actorTableBody');

let id = tableBody.children.length + 1;
let currentEditRow = null;

/* =====================
   CREATE
===================== */

createForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const value = createInput.value.trim();
  if (value === '') return;

  const row = document.createElement('tr');

  row.innerHTML = `
    <th scope="row">${id}</th>
    <td>${value}</td>
    <td class="operation">
      <i class="fa-solid fa-pen-to-square edit-btn"></i>
      <i class="fa-solid fa-trash delete-btn"></i>
    </td>
  `;

  tableBody.appendChild(row);

  id++;
  createInput.value = '';
  createModal.close();
});

/* =====================
   EDIT
===================== */

editForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const value = editInput.value.trim();
  if (value === '' || !currentEditRow) return;

  const nameCell = currentEditRow.children[1];
  nameCell.textContent = value;

  currentEditRow = null;
  editInput.value = '';
  editModal.close();
});

/* =====================
   DELETE + EDIT (open modal)
===================== */

tableBody.addEventListener('click', function (e) {
  // DELETE
  if (e.target.classList.contains('delete-btn')) {
    const row = e.target.closest('tr');
    row.remove();
  }

  // EDIT - open modal instead of prompt
  if (e.target.classList.contains('edit-btn')) {
    const row = e.target.closest('tr');
    const nameCell = row.children[1];

    currentEditRow = row;
    editInput.value = nameCell.textContent;
    editModal.showModal();
  }
});
