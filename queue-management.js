const numberOfRooms = 7;
const maxRecentQueues = 5;

function speakQueue(queueNumber, roomNumber) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `ห้อง ${roomNumber} คิวที่ ${queueNumber}`;
    utterance.lang = 'th-TH'; // ใช้ภาษาไทย
    utterance.rate = 0.8; // ปรับความเร็วของเสียงพูดให้ช้าลง
    window.speechSynthesis.speak(utterance);
}

function updateCalledQueue(roomNumber) {
    let queues = JSON.parse(localStorage.getItem(`calledQueue-${roomNumber}`)) || [];

    if (!Array.isArray(queues)) {
        queues = [];
    }

    const currentQueueNumber = queues.length > 0 ? Math.max(...queues.map(q => parseInt(q.split(' ')[1]))) + 1 : 1;
    queues.push(`คิว ${currentQueueNumber}`); // เพิ่มคิวใหม่

    if (queues.length > maxRecentQueues) {
        queues.shift(); // ลบคิวเก่าที่สุดเมื่อถึงจำนวนสูงสุด
    }

    localStorage.setItem(`calledQueue-${roomNumber}`, JSON.stringify(queues));
}

function saveCurrentQueue(queueNumber, roomNumber) {
    const queueData = { queue: queueNumber, room: roomNumber };
    localStorage.setItem('currentQueue', JSON.stringify(queueData));
}

function callNextQueue(roomNumber) {
    // รับคิวปัจจุบันจาก localStorage
    let currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
    const queuesKey = `calledQueue-${roomNumber}`;
    let calledQueues = JSON.parse(localStorage.getItem(queuesKey)) || [];

    if (currentQueue.room === roomNumber.toString()) {
        // ถ้าคิวปัจจุบันยังคงเป็นห้องเดิม ให้เพิ่มคิวที่เรียกไปแล้ว
        calledQueues.push(currentQueue.queue);
    }

    // เพิ่มคิวใหม่
    const newQueueNumber = (calledQueues.length > 0 ? Math.max(...calledQueues) : 0) + 1;
    currentQueue = { room: roomNumber.toString(), queue: newQueueNumber };

    // บันทึกคิวปัจจุบันและคิวที่เรียกไปแล้วใน localStorage
    localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
    localStorage.setItem(queuesKey, JSON.stringify(calledQueues));

    // อัพเดทข้อมูลในหน้าจอ
    updateQueueTable();
}

function updateQueueTable() {
    // แสดงข้อมูลคิวในหน้าเจ้าหน้าที่
    const roomElements = document.querySelectorAll('.room-info');
    roomElements.forEach(roomElement => {
        const roomNumber = parseInt(roomElement.dataset.room, 10);
        const currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
        const currentQueueNumber = (currentQueue.room === roomNumber.toString()) ? `คิว ${currentQueue.queue}` : 'ไม่มีคิวปัจจุบัน';

        const queuesString = localStorage.getItem(`calledQueue-${roomNumber}`);
        const recentQueues = (queuesString ? JSON.parse(queuesString) : []).slice(-5);

        roomElement.querySelector('.current-queue').textContent = currentQueueNumber;
        roomElement.querySelector('.recent-queues').textContent = recentQueues.join(', ') || 'ไม่มีคิวที่เรียกไปแล้ว';
    });
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

function updateQueueDisplay() {
    const currentQueueList = document.getElementById('currentQueueList');
    currentQueueList.innerHTML = '';

    const recentQueuesList = document.getElementById('recentQueuesList');
    recentQueuesList.innerHTML = '';

    for (let i = 1; i <= numberOfRooms; i++) {
        const currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
        const currentQueueNumber = (currentQueue.room === i.toString()) ? currentQueue.queue : 'ไม่มีคิวปัจจุบัน';

        const roomDiv = document.createElement('div');
        roomDiv.textContent = `ห้อง ${i}: คิวปัจจุบัน ${currentQueueNumber}`;
        currentQueueList.appendChild(roomDiv);

        const recentQueues = getRecentQueues(i);
        const recentQueuesDiv = document.createElement('div');
        recentQueuesDiv.textContent = `ห้อง ${i}: ${recentQueues.join(', ') || 'ไม่มีคิวที่เรียกไปแล้ว'}`;
        recentQueuesList.appendChild(recentQueuesDiv);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateQueueTable();
    
    const roomButtonsContainer = document.getElementById('roomButtons');

    // สร้างปุ่มสำหรับแต่ละห้อง
    for (let i = 1; i <= numberOfRooms; i++) {
        const button = document.createElement('button');
        button.textContent = `เรียกคิวห้อง ${i}`;
        button.className = 'call-queue-button';
        button.dataset.room = i; // ตั้งค่า data-room attribute
        roomButtonsContainer.appendChild(button);
    }

    const callQueueButtons = document.querySelectorAll('.call-queue-button');

    callQueueButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roomNumber = this.dataset.room;
            callNextQueue(roomNumber);
        });
    });

    const clearQueuesButton = document.getElementById('clearQueuesButton');
    if (clearQueuesButton) {
        clearQueuesButton.addEventListener('click', function() {
            for (let i = 1; i <= numberOfRooms; i++) {
                localStorage.removeItem(`calledQueue-${i}`);
            }
            localStorage.removeItem('currentQueue');
            updateQueueDisplay(); // อัปเดตหน้าจอการแสดงผลหลังการล้าง
        });
    }

    // อัปเดตหมายเลขคิวปัจจุบันเมื่อโหลดหน้า
    updateQueueDisplay();
});
