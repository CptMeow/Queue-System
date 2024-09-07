// queue-display.js

const numberOfRooms = 7;
const maxRecentQueues = 5;

function updateQueueTable() {
    const queueTableBody = document.getElementById('queueTableBody');
    queueTableBody.innerHTML = '';

    for (let i = 1; i <= numberOfRooms; i++) {
        const currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
        const currentQueueNumber = (currentQueue.room === i.toString()) ? `คิว ${currentQueue.queue}` : 'ไม่มีคิวปัจจุบัน';

        const recentQueues = getRecentQueues(i);
        const recentQueuesText = recentQueues.length > 0 ? recentQueues.join(', ') : 'ไม่มีคิวที่เรียกไปแล้ว';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>ห้อง ${i}</td>
            <td>${currentQueueNumber}</td>
            <td>${recentQueuesText}</td>
        `;
        queueTableBody.appendChild(row);
    }
}

function getRecentQueues(roomNumber) {
    const queuesString = localStorage.getItem(`calledQueue-${roomNumber}`);
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

document.addEventListener('DOMContentLoaded', function() {
    updateQueueTable();
});
