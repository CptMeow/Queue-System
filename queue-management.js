const numberOfRooms = 7;
const maxRecentQueues = 5;

function updateCalledQueue(roomNumber) {
    let queues = JSON.parse(localStorage.getItem(`calledQueue-${roomNumber}`)) || [];

    if (!Array.isArray(queues)) {
        queues = [];
    }

    queues.push(`คิว ${queues.length + 1}`); // เพิ่มคิวใหม่

    if (queues.length > maxRecentQueues) {
        queues.shift(); // ลบคิวเก่าที่สุดเมื่อถึงจำนวนสูงสุด
    }

    localStorage.setItem(`calledQueue-${roomNumber}`, JSON.stringify(queues));
}

function saveCurrentQueue(queueNumber, roomNumber) {
    const queueData = { queue: queueNumber, room: parseInt(roomNumber) };
    localStorage.setItem('currentQueue', JSON.stringify(queueData));
}

function loadCurrentQueue() {
    let savedQueue = localStorage.getItem('currentQueue');
    if (savedQueue) {
        return JSON.parse(savedQueue);
    }
    return { queue: 0, room: 1 }; // ค่าพื้นฐานถ้าไม่มีข้อมูล
}

function callNextQueue() {
    const roomSelect = document.getElementById('roomSelect');
    const selectedRoom = roomSelect ? roomSelect.value : null;

    if (!selectedRoom) {
        console.error('กรุณาเลือกห้องก่อนเรียกคิว');
        return;
    }

    let currentQueue = loadCurrentQueue();
    let nextQueueNumber = currentQueue.queue + 1;

    updateCalledQueue(selectedRoom);
    saveCurrentQueue(nextQueueNumber, selectedRoom);

    playQueueAudio(nextQueueNumber, selectedRoom);

    updateQueueDisplays();
}

function clearAllQueues() {
    for (let i = 1; i <= numberOfRooms; i++) {
        localStorage.removeItem(`calledQueue-${i}`);
    }
    localStorage.removeItem('currentQueue');

    updateQueueDisplays();
}

function playQueueAudio(queueNumber, roomNumber) {
    const text = `เรียกคิว ${queueNumber} ห้อง ${roomNumber}`;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'th-TH'; // ภาษาไทย
    utterance.pitch = 1;
    utterance.rate = 0.5; // ความเร็วของเสียง (ช้าลง)

    speechSynthesis.speak(utterance);
}

function updateQueueDisplays() {
    // สร้างเหตุการณ์ใหม่เพื่อกระตุ้นการอัพเดต
    const event = new Event('storage');
    event.key = `calledQueue-${document.getElementById('roomSelect').value}`;
    window.dispatchEvent(event);
}

document.addEventListener('DOMContentLoaded', function() {
    function addRoomOptions() {
        const roomSelect = document.getElementById('roomSelect');
        if (roomSelect) {
            roomSelect.innerHTML = '';

            for (let i = 1; i <= numberOfRooms; i++) {
                let option = document.createElement('option');
                option.value = i;
                option.textContent = `ห้อง ${i}`;
                roomSelect.appendChild(option);
            }
        }
    }

    addRoomOptions();

    document.getElementById('callQueueButton').addEventListener('click', function() {
        callNextQueue();
    });

    document.getElementById('clearQueueButton').addEventListener('click', function() {
        clearAllQueues();
    });
});
