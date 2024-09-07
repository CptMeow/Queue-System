// queue-display.js

const numberOfRooms = 7;
const maxRecentQueues = 5;

function updateQueueTable() {
    const currentQueueDisplay = document.getElementById('currentQueueDisplay');
    const recentQueuesDisplay = document.getElementById('recentQueuesDisplay');

    currentQueueDisplay.innerHTML = '';
    recentQueuesDisplay.innerHTML = '';

    for (let i = 1; i <= numberOfRooms; i++) {
        const currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
        const currentQueueNumber = (currentQueue.room === i.toString()) ? `คิว ${currentQueue.queue}` : 'ไม่มีคิวปัจจุบัน';

        const roomDiv = document.createElement('div');
        roomDiv.textContent = `ห้อง ${i}: ${currentQueueNumber}`;
        currentQueueDisplay.appendChild(roomDiv);

        const recentQueues = getRecentQueues(i);
        const recentQueuesDiv = document.createElement('div');
        recentQueuesDiv.textContent = `ห้อง ${i}: ${recentQueues.join(', ') || 'ไม่มีคิวที่เรียกไปแล้ว'}`;
        recentQueuesDisplay.appendChild(recentQueuesDiv);
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
