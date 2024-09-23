const link = "http://localhost:9087"
async function saveSessionSettings() {
    const sessionDate = document.getElementById('session-date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    if (!sessionDate || !startTime || !endTime) {
        alert("Please fill in all fields before saving.");
        return;
    }
    
    const sessionId = Math.random().toString(36).substring(2, 20);
    await fetch('http://localhost:9087/save-session-settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: sessionDate, startTime, endTime, sessionId }),
    });

    document.getElementById('session-date').value = '';
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';

    alert(`Session saved with Date: ${sessionDate}, Start Time: ${startTime}, End Time: ${endTime}`);
}

// Set the current date and disable past dates
window.onload = () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('session-date').value = today;
    document.getElementById('session-date').setAttribute('min', today);
};
