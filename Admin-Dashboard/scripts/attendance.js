const link = "http://localhost:9087"
async function loadAttendanceData() {
    const attendanceResponse = await fetch('http://localhost:9087/attendance');
    const attendanceData = await attendanceResponse.json();
    const attendanceList = document.getElementById('attendance-list');

    attendanceList.innerHTML = ''; 

    attendanceData.records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.userId}</td>
            <td id="attendance-${record.userId}">${record.attendanceCount}</td>
            <td>
                <button onclick="updateAttendance('${record.userId}', false)">Decrease</button>
                <button onclick="updateAttendance('${record.userId}', true)">Increase</button>
            </td>
        `;
        attendanceList.appendChild(row);
    });
}

async function updateAttendance(userId, increment) {
    const response = await fetch(`http://localhost:9087/attendance/increment-decrement/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment }), 
    });

    if (response.ok) {
        loadAttendanceData(); 
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
}

// Load attendance data on page load
window.onload = loadAttendanceData;
