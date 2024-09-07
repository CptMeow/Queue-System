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

    const currentQueueNumber = queues.length + 1;
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
    let currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
    const queueNumber = (currentQueue.queue || 0) + 1;

    saveCurrentQueue(queueNumber, roomNumber);
    updateCalledQueue(roomNumber);
    speakQueue(queueNumber, roomNumber); // เรียกใช้ฟังก์ชันพูด

    // อัปเดตหน้าจอจัดการคิว
    updateQueueDisplay();
}

function updateQueueDisplay() {
    const currentQueueList = document.getElementById('currentQueueList');
    currentQueueList.innerHTML = '';

    for (let i = 1; i <= numberOfRooms; i++) {
        const currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
        const currentQueueNumber = (currentQueue.room === i.toString()) ? currentQueue.queue : 'ไม่มีคิวปัจจุบัน';

        const roomDiv = document.createElement('div');
        roomDiv.textContent = `ห้อง ${i}: ${currentQueueNumber}`;
        currentQueueList.appendChild(roomDiv);
    }
}

document.addEventListener('DOMContentLoaded', function() {
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
