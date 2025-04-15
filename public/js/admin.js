const token = localStorage.getItem('token');

if (!token) {
  alert('Session expired. Please login again.');
  window.location.href = '/login.html';
}

fetch('http://localhost:3000/admin/users', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#usersTable tbody');
    data.users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.user_id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button onclick="deleteUser(${user.user_id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error(err);
    alert('Failed to load users.');
  });

function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  fetch(`http://localhost:3000/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(result => {
      alert(result.message || result.error);
      location.reload();
    })
    .catch(err => {
      console.error(err);
      alert('Error deleting user.');
    });
}
