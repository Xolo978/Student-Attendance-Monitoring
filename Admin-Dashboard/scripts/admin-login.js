const link = "https://student-attendance-monitoring.onrender.com"
async function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    const response = await fetch(`${link}/admin-login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const loginMessage = document.getElementById('login-message');

    if (response.ok) {
        window.location.href = 'admin.html'; // Redirect to the admin dashboard
    } else {
        loginMessage.textContent = 'Login failed. Please check your credentials.';
        loginMessage.style.color = 'red';
    }
}
