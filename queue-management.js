document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7;

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
        } else {
            console.error("ไม่พบ select box สำหรับห้อง");
        }
    }

    function initializeQueue() {
        for (let i = 1; i <= numberOfRooms; i++) {
            if (!localStorage.getItem(`calledQueue-${i}`)) {
                localStorage.setItem(`calledQueue-${i}`, 0);
            }
        }
        if (!localStorage.getItem('currentQueue')) {
            localStorage.setItem('currentQueue', JSON.stringify({ queue: 0, room: 1 }));
        }
    }

    function loadCurrentQueue() {
        let savedQueue = localStorage.getItem('currentQueue');
        if (savedQueue) {
            return JSON.parse(savedQueue);
        }
        console.error("ไม่มีคิวใน LocalStorage");
        return null;
    }

    function updateCalledQueue(roomNumber) {
        let calledQueue = parseInt(localStorage.getItem(`calledQueue-${roomNumber}`)) || 0;
        calledQueue++;
        localStorage.setItem(`calledQueue-${roomNumber}`, calledQueue);
    }

    function saveCurrentQueue(queueNumber, roomNumber) {
        const queueData = { queue: queueNumber, room: parseInt(roomNumber) };
        localStorage.setItem('currentQueue', JSON.stringify(queueData));
    }

    function callNextQueue() {
        const roomSelect = document.getElementById('roomSelect');
        const selectedRoom = roomSelect ? roomSelect.value : null;

        if (!selectedRoom) {
            console.error("กรุณาเลือกห้อง");
            return;
        }

        let currentQueue = loadCurrentQueue();
        if (currentQueue && currentQueue.room === parseInt(selectedRoom)) {
            let nextQueueNumber = currentQueue.queue + 1;
            updateCalledQueue(selectedRoom);
            saveCurrentQueue(nextQueueNumber, selectedRoom);

            // เรียกใช้ฟังก์ชันเสียง
            playQueueAudio(nextQueueNumber, selectedRoom);

            // อัพเดตหน้าจอแสดงคิว
            updateQueueDisplays();
        } else {
            console.error("ไม่มีคิวปัจจุบันในการเรียกหรือห้องไม่ถูกต้อง");
        }
    }

function clearAllQueues() {
    for (let i = 1; i <= numberOfRooms; i++) {
        localStorage.removeItem(`calledQueue-${i}`);
    }
    localStorage.removeItem('currentQueue');

    // อัพเดตหน้าจอแสดงคิวหลังจากล้างคิว
    updateQueueDisplays();
}


    function playQueueAudio(queueNumber, roomNumber) {
        const text = `เรียกคิว ${queueNumber} ห้อง ${roomNumber}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'th-TH'; // ภาษาไทย
        utterance.pitch = 1; // ความสูงของเสียง
        utterance.rate = 1; // ความเร็วของเสียง

        speechSynthesis.speak(utterance);
    }

    function updateQueueDisplays() {
        const queueDisplays = document.querySelectorAll('[id^="currentQueue-"]');
        queueDisplays.forEach(span => {
            const roomNumber = span.id.split('-')[1];
            let currentQueue = loadCurrentQueue();
            if (currentQueue && currentQueue.room == roomNumber) {
                span.textContent = currentQueue.queue;
            } else {
                span.textContent = 'ไม่มีคิว';
            }
        });
    }

    // เริ่มต้นระบบ
    initializeQueue();

    document.getElementById('callQueueButton').addEventListener('click', function() {
        callNextQueue();
    });

    document.getElementById('clearQueueButton').addEventListener('click', function() {
        clearAllQueues();
        updateQueueDisplays(); // อัพเดตหน้าจอหลังจากล้างคิว
    });

    addRoomOptions();
});
