const sessionList = document.getElementById('session-list');

function calculateTimeRemaining(startTime, endTime) {
    const now = new Date();
    const sessionStart = new Date(startTime);
    const sessionEnd = new Date(endTime);

    // If the session has ended
    if (now >= sessionEnd) {
        return "Session Ended";
    }

    // If the session hasn't started yet, calculate time until it starts
    if (now < sessionStart) {
        const timeDifference = sessionStart - now; // Time difference in milliseconds
        const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Hours
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Minutes
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000); // Seconds

        return `${hours}h ${minutes}m ${seconds}s remaining`;
    }

    // If the session is ongoing
    return "Session has started";
}

async function fetchSessions() {
    try {
        const response = await fetch('http://localhost:9087/session-settings');
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

async function joinSession(sessionId) {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
        alert('User is not logged in!');
        return;
    }

    try {
        const attendanceResponse = await fetch(`http://localhost:9087/attendance/update/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ attended: true, sessionId }), // Pass sessionId in the request
        });

        const attendanceData = await attendanceResponse.json();
        if (attendanceResponse.ok) {
            // Fetch session details after updating attendance
            const sessionResponse = await fetch(`http://localhost:9087/session/${sessionId}`);
            const sessionDetails = await sessionResponse.json();
            const startTime = sessionDetails.startTime
            const endTime = sessionDetails.endTime
            const date = sessionDetails.date
            // Store session details in sessionStorage
            sessionStorage.setItem("sessionId", JSON.stringify({ sessionId ,  startTime, endTime, date })); // Store the entire session object

            window.location.href = `join-session.html`;
        } else {
            alert(attendanceData.message); // Show the message if attendance was already recorded
            console.error('Error updating attendance:', attendanceData.message);
        }
    } catch (error) {
        console.error('Error joining session:', error);
    }
}

// Fetch sessions when the script loads
fetchSessions();
