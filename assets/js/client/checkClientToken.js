const checkedToken = localStorage.getItem('client_token');

if (!checkedToken) {
  window.location.href = './login.html';
}