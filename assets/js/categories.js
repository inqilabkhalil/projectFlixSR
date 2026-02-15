const modal = document.getElementById('categoryModal');
const form = modal.querySelector('form');
const input = document.querySelector('.modalInput');
const tableBody = document.getElementById('categoryTableBody');

let id = tableBody.children.length + 1;

/* =====================
   CREATE
===================== */

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const value = input.value.trim();
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
  input.value = '';
  modal.close();
});

/* =====================
   DELETE + EDIT
===================== */

tableBody.addEventListener('click', function (e) {
  // DELETE
  if (e.target.classList.contains('delete-btn')) {
    const row = e.target.closest('tr');
    row.remove();
  }

  // EDIT
  if (e.target.classList.contains('edit-btn')) {
    const row = e.target.closest('tr');
    const nameCell = row.children[1];

    const newName = prompt('Edit category name:', nameCell.textContent);

    if (newName !== null && newName.trim() !== '') {
      nameCell.textContent = newName.trim();
    }
  }
});
