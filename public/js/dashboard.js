document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("Please log in first.");
      window.location.href = "index.html";
      return;
    }
  
    fetch("http://localhost:3000/dashboard", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error("Auth failed or token expired");
      return res.json();
    })
    .then(data => {
      const user = data.user;
      document.getElementById("user-info").innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role}</p>
      `;
      document.getElementById("status-message").textContent = "Redirecting...";
  
      // Redirect based on role
      setTimeout(() => {
        if (user.role === "admin") {
          window.location.href = "admin.html";
        } else if (user.role === "buyer") {
          window.location.href = "search.html";
        } else if (user.role === "owner") {
          window.location.href = "manage-listings.html";
        } else {
          document.getElementById("status-message").textContent = "Unknown role.";
        }
      }, 2000);
    })
    .catch(err => {
      console.error(err);
      alert("Session expired. Please log in again.");
      localStorage.removeItem('token');
      window.location.href = "index.html";
    });
  });
  