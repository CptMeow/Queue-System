document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7;
    const maxRecentQueues = 5;

    function getRecentQueues(roomNumber) {
        const calledQueueKey = `calledQueue-${roomNumber}`;
        const queues = localStorage.getItem(calledQueueKey);
        if (queues) {
            return JSON.parse(queues).slice(-maxRecentQueues);
        }
        return [];
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
