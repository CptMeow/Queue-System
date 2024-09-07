document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7; // จำนวนห้องที่กำหนดไว้ล่วงหน้า

    function addRoomOptions() {
        const roomSelect = document.getElementById('roomSelect');
        if (roomSelect) {
            roomSelect.innerHTML = ''; // ล้างตัวเลือกห้องก่อนหน้า

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
            playAudio(`เสียงเรียกคิว ${nextQueueNumber} ห้อง ${selectedRoom}.mp3`);

            // อัพเดตหน้าจอแสดงคิว
            updateQueueDisplay(selectedRoom, nextQueueNumber);
        } else {
            console.error("ไม่มีคิวปัจจุบันในการเรียกหรือห้องไม่ถูกต้อง");
        }
    }

    function clearAllQueues() {
        for (let i = 1; i <= numberOfRooms; i++) {
            localStorage.removeItem(`calledQueue-${i}`);
        }
        localStorage.removeItem('currentQueue');
    }

    function playAudio(filename) {
        const audio = new Audio(`audio/${filename}`);
        audio.play().catch(error => console.error("ไม่สามารถเล่นเสียงได้:", error));
    }

    function updateQueueDisplay(roomNumber, queueNumber) {
        fetch('queue-display.html')
            .then(response => response.text())
            .then(html => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let queueSpan = doc.getElementById(`currentQueue-${roomNumber}`);
                if (queueSpan) {
                    queueSpan.innerText = queueNumber;
                } else {
                    console.error(`ไม่พบ <span> สำหรับห้อง ${roomNumber}`);
                }
            })
            .catch(error => console.error("เกิดข้อผิดพลาดในการดึงหน้าแสดงคิว:", error));
    }

    // เริ่มต้นระบบ
    initializeQueue();

    document.getElementById('callQueueButton').addEventListener('click', function() {
        callNextQueue();
    });

    document.getElementById('clearQueueButton').addEventListener('click', function() {
        clearAllQueues();
        updateQueueDisplay(); // อัพเดตหน้าจอหลังจากล้างคิว
    });

    addRoomOptions();
});
