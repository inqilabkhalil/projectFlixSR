const logOutItem = document.querySelector('.logout-item');

function logOutIconClick() {
  localStorage.removeItem('client_token');
  window.location.href = '../../index.html';
}

logOutItem.addEventListener('click', logOutIconClick);