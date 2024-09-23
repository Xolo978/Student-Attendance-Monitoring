const link = "https://student-attendance-monitoring.onrender.com"
async function loadCurrentSessions() {
    const response = await fetch('https://student-attendance-monitoring.onrender.com/session-settings');
    const sessions = await response.json();


    const sessionsList = document.getElementById('sessions-list');
    sessionsList.innerHTML = ''; 

    sessions.sort((a, b) => {
        const startA = new Date(`${a.date}T${a.startTime}:00`);
        const startB = new Date(`${b.date}T${b.startTime}:00`);
        return startB - startA; 
    });

    sessions.forEach(session => {
        const row = document.createElement('tr');

        const startTime = new Date(`${session.date}T${session.startTime}:00`);
        const endTime = new Date(`${session.date}T${session.endTime}:00`);

        let timeRemaining = getTimeRemaining(startTime, endTime);

        row.innerHTML = `
            <td>${session.sessionId}</td>
            <td>${formatDate(startTime)}</td>
            <td>${session.startTime}</td>
            <td>${session.endTime}</td>
            <td class="time-remaining">${timeRemaining}</td>
            <td><button class="delete-button" data-id="${session._id}">Delete</button></td>
        `;
        sessionsList.appendChild(row);

        const countdownElement = row.querySelector('.time-remaining');
        const intervalId = setInterval(() => {
            timeRemaining = getTimeRemaining(startTime, endTime);
            countdownElement.innerText = timeRemaining;

            if (timeRemaining === 'Session Ended') {
                clearInterval(intervalId);
            }
        }, 1000);

        const deleteButton = row.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => deleteSession(session._id));
    });
}

async function deleteSession(sessionId) {
    const confirmed = confirm('Are you sure you want to delete this session?');
    if (!confirmed) return;

    try {
        const response = await fetch(`https://student-attendance-monitoring.onrender.com/session-settings/${sessionId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Session deleted successfully');
            loadCurrentSessions();  
        } else {
            alert('Failed to delete session');
        }
    } catch (error) {
        console.error('Error deleting session:', error);
    }
}

function getTimeRemaining(startTime, endTime) {
    const now = new Date();

    if (now < startTime) {
        const timeUntilStart = startTime - now;
        const seconds = Math.floor((timeUntilStart / 1000) % 60);
        const minutes = Math.floor((timeUntilStart / 1000 / 60) % 60);
        const hours = Math.floor((timeUntilStart / (1000 * 60 * 60)) % 24);
        return `Session starts in: ${hours}h ${minutes}m ${seconds}s`;
    }

    const total = endTime - now;

    if (total <= 0) {
        return 'Session Ended'; 
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m ${seconds}s`;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

window.onload = loadCurrentSessions;
