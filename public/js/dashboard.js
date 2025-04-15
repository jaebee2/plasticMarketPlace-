const token = localStorage.getItem('token');
console.log('🔐 Retrieved token:', token);

if (!token || tokenIsExpired(token)) {
  console.warn('⚠️ No token or expired token detected');
  alert('Session expired. Please log in again.');
  localStorage.removeItem('token');
  window.location.href = '/login.html';
} else {
  fetch('http://localhost:3000/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      console.log('📡 Fetch response status:', res.status);
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then(data => {
      console.log('✅ Fetched user data:', data);
      const user = data.user;

      document.getElementById('user-info').innerHTML = `
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Role: ${user.role}</p>
      `;
      document.getElementById('status-message').textContent = 'Redirecting...';

      setTimeout(() => {
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
      }, 500);
    })
    .catch(error => {
      console.error('❌ Fetch error:', error);
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    });
}

function tokenIsExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = Date.now() >= payload.exp * 1000;
    console.log('⏱️ Token expiry check:', new Date(payload.exp * 1000), '| Expired?', isExpired);
    return isExpired;
  } catch (err) {
    console.error('❌ Error parsing token:', err);
    return true;
  }
}
