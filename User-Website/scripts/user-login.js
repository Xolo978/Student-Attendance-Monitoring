document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:9087/user-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, password }),
        });

        const data = await response.json();
        if (!data.success) {
            showErrorPopup(data.message); 
        } else {
            
            sessionStorage.clear();
            sessionStorage.setItem('userId', data.user.userId);
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error during login:', error);
        showErrorPopup('An error occurred. Please try again.');
    }
});

function showErrorPopup(message) {
    const popup = document.getElementById('error-popup');
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = message;
    popup.style.display = 'block'; 

    
    document.getElementById('close-popup').onclick = function() {
        popup.style.display = 'none';
    };

   
    window.onclick = function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    };
}
