const sessionList = document.getElementById('session-list');

// Function to calculate the remaining time for the session
function calculateTimeRemaining(startTime, endTime) {
    const now = new Date();
    const sessionStart = new Date(startTime);
    const sessionEnd = new Date(endTime);

    if (now >= sessionEnd) {
        return "Session Ended";
    }

    if (now < sessionStart) {
        const timeDifference = sessionStart - now; 
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); 
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s remaining`;
    }

    // If the session is ongoing
    return "Session has started";
}

// Function to fetch sessions from the backend and display them
async function fetchSessions() {
    try {
        const response = await fetch('https://student-attendance-monitoring.onrender.com/session-settings');
        const sessions = await response.json();

        // Sort sessions by start time (most recent first)
        sessions.sort((a, b) => {
            const startA = new Date(`${a.date}T${a.startTime}:00`);
            const startB = new Date(`${b.date}T${b.startTime}:00`);
            return startB - startA;
        });

        sessionList.innerHTML = ''; // Clear existing session list before appending

        sessions.forEach(session => {
            const startTime = `${session.date}T${session.startTime}:00`; // Format start time
            const endTime = `${session.date}T${session.endTime}:00`; // Format end time

            // Calculate time remaining based on start and end times
            const timeRemaining = calculateTimeRemaining(startTime, endTime);

            // Create row for each session
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${session.sessionId}</td>
                <td>${formatDate(new Date(session.date))}</td> <!-- Properly format the date -->
                <td>${session.startTime}</td>
                <td>${session.endTime}</td>
                <td class="time-remaining">${timeRemaining}</td>
                <td>
                    <button onclick="joinSession('${session.sessionId}')" 
                        class="join-button ${timeRemaining === 'Session Ended' ? 'disabled' : ''}" 
                        ${timeRemaining === 'Session Ended' ? 'disabled' : ''}>
                        Join
                    </button>
                </td>
            `;

            sessionList.appendChild(row);

            const countdownElement = row.querySelector('.time-remaining');
            const joinButton = row.querySelector('.join-button');

            const intervalId = setInterval(() => {
                const newTimeRemaining = calculateTimeRemaining(startTime, endTime);
                countdownElement.innerText = newTimeRemaining;

                if (newTimeRemaining === 'Session Ended') {
                    joinButton.classList.add('disabled');
                    joinButton.disabled = true;
                    clearInterval(intervalId);
                }
            }, 1000);
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
    }
}

// Format the date in 'YYYY-MM-DD' format
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to join a session (you can add additional logic as per your needs)
function joinSession(sessionId) {
    console.log(`Joining session: ${sessionId}`);
    // Add your join session logic here
}

// Load sessions on page load
window.onload = fetchSessions;
