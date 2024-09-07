// queue-management.js

const numberOfRooms = 7;

function callNextQueue(roomNumber) {
    let currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
    const queuesKey = `calledQueue-${roomNumber}`;
    let calledQueues = JSON.parse(localStorage.getItem(queuesKey)) || [];

    if (currentQueue.room === roomNumber.toString()) {
        calledQueues.push(currentQueue.queue);
    }

    const newQueueNumber = (calledQueues.length > 0 ? Math.max(...calledQueues) : 0) + 1;
    currentQueue = { room: roomNumber.toString(), queue: newQueueNumber };

    localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
    localStorage.setItem(queuesKey, JSON.stringify(calledQueues));

    updateQueueTable();
    speakQueue(currentQueue);
}

function speakQueue(queue) {
    const queueText = `ห้อง ${queue.room}, คิว ${queue.queue}`;
    const utterance = new SpeechSynthesisUtterance(queueText);
    utterance.lang = 'th-TH'; // ภาษาไทย
    utterance.rate = 0.8; // ความเร็วของเสียงพูด (0.1 ถึง 2, ค่าเริ่มต้นคือ 1)

    // ตรวจสอบว่ามีเสียงพูดอยู่หรือไม่
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel(); // หยุดเสียงที่กำลังเล่นอยู่
    }

    speechSynthesis.speak(utterance);
}

function updateQueueTable() {
    const roomButtons = document.getElementById('roomButtons');
    const currentQueueInfo = document.getElementById('currentQueueInfo');
    const recentQueueInfo = document.getElementById('recentQueueInfo');

    if (!roomButtons || !currentQueueInfo || !recentQueueInfo) {
        console.error('One or more required elements are missing in the HTML.');
        return;
    }

    roomButtons.innerHTML = '';
    currentQueueInfo.innerHTML = '';
    recentQueueInfo.innerHTML = '';

    for (let i = 1; i <= numberOfRooms; i++) {
        const button = document.createElement('button');
        button.textContent = `เรียกคิวห้อง ${i}`;
        button.addEventListener('click', () => callNextQueue(i));
        roomButtons.appendChild(button);

        const currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
        const currentQueueNumber = (currentQueue.room === i.toString()) ? `คิว ${currentQueue.queue}` : 'ไม่มีคิวปัจจุบัน';

        const currentQueueDiv = document.createElement('div');
        currentQueueDiv.textContent = `ห้อง ${i}: ${currentQueueNumber}`;
        currentQueueInfo.appendChild(currentQueueDiv);

        const recentQueues = getRecentQueues(i);
        const recentQueuesText = recentQueues.length > 0 ? recentQueues.join(', ') : 'ไม่มีคิวที่เรียกไปแล้ว';

        const recentQueueDiv = document.createElement('div');
        recentQueueDiv.textContent = `ห้อง ${i}: ${recentQueuesText}`;
        recentQueueInfo.appendChild(recentQueueDiv);
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

    return queues.slice(-5);
}

document.addEventListener('DOMContentLoaded', function() {
    updateQueueTable();
});
