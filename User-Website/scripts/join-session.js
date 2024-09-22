let warnings = 4;
let sessionIdKey = 'sessionId';
let sessionId = sessionStorage.getItem(sessionIdKey);
let isSessionOver = false;
// Parse the sessionId as JSON
const sessionDetails = JSON.parse(sessionId);

if (!sessionDetails) {
    alert('Session details not found. Please try again.');
    window.location.href = 'dashboard.html'; 
}


const sessionStartTime = new Date(`${sessionDetails.date}T${sessionDetails.startTime}:00`);
const sessionEndTime = new Date(`${sessionDetails.date}T${sessionDetails.endTime}:00`);

if (isNaN(sessionStartTime) || isNaN(sessionEndTime)) {
    console.error('Invalid start or end time:', sessionStartTime, sessionEndTime);
    alert('Session time is invalid. Please check the session details.');
    window.location.href = 'dashboard.html'; 
}

console.log({ sessionStartTime, sessionEndTime });

document.addEventListener('DOMContentLoaded', () => {
    enterFullScreen();
    setInterval(updateTimeRemaining, 1000);
    updateTimeRemaining();
    preventInspectAndReload();
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

function enterFullScreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { 
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { 
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { 
        document.documentElement.msRequestFullscreen();
    }
}

function updateTimeRemaining() {
    const now = new Date();
    const timeRemainingStart = Math.max((sessionStartTime - now) / 1000, 0);
    const timeRemainingEnd = Math.max((sessionEndTime - now) / 1000, 0);

    document.getElementById('time-remaining-start').innerText = `Time Remaining to Start: ${formatTime(timeRemainingStart)}`;
    document.getElementById('time-remaining-end').innerText = `Time Remaining to End: ${formatTime(timeRemainingEnd)}`;

    if (timeRemainingStart <= 0 && !isSessionOver) {
        isSessionOver = true; 
        clearSessionAndRedirect();
    }
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
}

function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        const currentUrl = window.location.href;

        if (!currentUrl.includes('mathworks')) {
            warnings--;

            if (warnings < 0) {
                warnings = 0;
            }

            if (warnings <= 0) {
                decrementAttendance().then(() => {
                    clearSessionAndRedirect();
                });
            } else if (warnings === 1) {
                alert('Final Warning: Your attendance will be removed after this. Do not go to another tab!');
            } else {
                alert(`Warning: You have ${warnings} warnings left. Do not go to another tab!`);
            }
        }
    }
}

async function decrementAttendance() {
    const userId = sessionDetails.userId;
    const sessionId = sessionDetails.sessionId;

    try {
        const response = await fetch(`http://localhost:9087/attendance/update/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ attended: false, sessionId: sessionId }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Attendance decremented successfully:', data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function clearSessionAndRedirect() {
    sessionStorage.clear(); 
    window.location.href = 'https://matlab.mathworks.com/';
    window.close();
}

function preventInspectAndReload() {
    document.onkeydown = function (e) {
        if (e.key === "F12" || (e.ctrlKey && (e.key === "u" || e.key === "s" || e.key === "Shift"))) {
            return false; 
        }
    };

    window.onbeforeunload = function () {
        return "Are you sure you want to leave this page?"; 
    };

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault(); 
    });
}
