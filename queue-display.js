document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7;
    const maxRecentQueues = 5;

    function getCurrentQueue(roomNumber) {
        const currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
        if (currentQueue.room === roomNumber.toString()) {
            return currentQueue.queue;
        }
        return 'ไม่มีคิวปัจจุบัน';
    }

    function getRecentQueues(roomNumber) {
        const calledQueueKey = `calledQueue-${roomNumber}`;
        const queuesString = localStorage.getItem(calledQueueKey);

        let queues = [];
        if (queuesString) {
            try {
                queues = JSON.parse(queuesString);
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
            const currentQueue = getCurrentQueue(i);
            const recentQueues = getRecentQueues(i);

            const row = document.createElement('tr');
            const roomCell = document.createElement('td');
            const currentQueueCell = document.createElement('td');
            const queuesCell = document.createElement('td');

            roomCell.textContent = `ห้อง ${i}`;
            currentQueueCell.textContent = currentQueue;
            queuesCell.textContent = recentQueues.length > 0 ? recentQueues.join(', ') : 'ไม่มีคิว';

            row.appendChild(roomCell);
            row.appendChild(currentQueueCell);
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
