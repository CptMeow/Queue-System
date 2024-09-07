document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7;
    const maxRecentQueues = 5;

    function getRecentQueues(roomNumber) {
        const calledQueueKey = `calledQueue-${roomNumber}`;
        const queuesString = localStorage.getItem(calledQueueKey);

        let queues = [];
        if (queuesString) {
            try {
                queues = JSON.parse(queuesString);
                // ตรวจสอบว่า queues เป็นอาเรย์
                if (!Array.isArray(queues)) {
                    queues = [];
                }
            } catch (e) {
                console.error('Error parsing queues:', e);
                queues = [];
            }
        }
        return queues.slice(-maxRecentQueues);
    }

    function updateQueueTable() {
        const tableBody = document.getElementById('queueTableBody');
        tableBody.innerHTML = '';

        for (let i = 1; i <= numberOfRooms; i++) {
            const recentQueues = getRecentQueues(i);

            const row = document.createElement('tr');
            const roomCell = document.createElement('td');
            const queuesCell = document.createElement('td');

            roomCell.textContent = `ห้อง ${i}`;

            const queueList = recentQueues.length > 0 ? recentQueues.join(', ') : 'ไม่มีคิว';
            queuesCell.textContent = queueList;

            row.appendChild(roomCell);
            row.appendChild(queuesCell);
            tableBody.appendChild(row);
        }
    }

    function loadQueueData() {
        updateQueueTable();
    }

    loadQueueData();

    setInterval(loadQueueData, 5000);
});
