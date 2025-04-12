const token = localStorage.getItem('token');
if (!token) {
  alert('Session expired. Please log in again.');
  window.location.href = '/login.html';
}

fetch('http://localhost:3000/dashboard', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => {
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  })
  .then(data => {
    const user = data.user;
    document.getElementById('user-info').innerHTML = `
      <p>Name: ${user.name}</p>
      <p>Email: ${user.email}</p>
      <p>Role: ${user.role}</p>
    `;
    document.getElementById('status-message').textContent = 'Redirecting...';

    // 👇 Role-based redirect
    switch (user.role.toLowerCase()) {
      case 'admin':
        window.location.href = '/admin.html';
        break;
      case 'user':
        window.location.href = '/user.html';
        break;
        case 'buyer':
          window.location.href = '/buyer.html';
          break;
      default:
        alert('Unknown role');
        break;
    }
  })
  .catch(error => {
    console.error(error);
    alert('Session expired. Please log in again.');
    window.location.href = '/login.html';
  });
