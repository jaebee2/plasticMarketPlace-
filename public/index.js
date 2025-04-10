const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// Replace with your backend URL if different
const BASE_URL = 'http://localhost:5000';

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(signupForm);
  const data = Object.fromEntries(formData);

  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message || result.error);
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData);

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (result.token) {
    alert('Login successful!');
    localStorage.setItem('token', result.token);
    window.location.href = '/dashboard.html';  // 👈 redirect
  } else {
    alert(result.error);
  }
  
  
});
