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
            console.log("เพิ่มตัวเลือกห้องใน select box:", numberOfRooms);
        } else {
            console.error("ไม่พบ select box สำหรับห้อง");
        }
    }

    function initializeQueue() {
        for (let i = 1; i <= numberOfRooms; i++) {
            // ตั้งค่าเริ่มต้นสำหรับคิวที่เรียกไปแล้ว
            if (!localStorage.getItem(`calledQueue-${i}`)) {
                localStorage.setItem(`calledQueue-${i}`, 0);
            }
        }
        // ตั้งค่าคิวปัจจุบันเริ่มต้น
        if (!localStorage.getItem('currentQueue')) {
            localStorage.setItem('currentQueue', JSON.stringify({ queue: 0, room: 1 }));
        }
        console.log("ระบบเริ่มต้นเสร็จสิ้น");
    }

    function loadCurrentQueue() {
        let savedQueue = localStorage.getItem('currentQueue');
        if (savedQueue) {
            console.log("คิวที่บันทึกไว้ใน LocalStorage:", savedQueue);
            return JSON.parse(savedQueue);
        }
        console.error("ไม่มีคิวใน LocalStorage");
        return null;
    }

    function updateCalledQueue(roomNumber) {
        let calledQueue = parseInt(localStorage.getItem(`calledQueue-${roomNumber}`)) || 0;
        console.log(`อัพเดตคิวที่เรียกไปแล้วในห้อง ${roomNumber}:`, calledQueue);
        calledQueue++;
        localStorage.setItem(`calledQueue-${roomNumber}`, calledQueue);
        console.log(`คิวที่เรียกไปแล้วในห้อง ${roomNumber} หลังจากอัพเดต:`, calledQueue);
    }

    function saveCurrentQueue(queueNumber, roomNumber) {
        const queueData = { queue: queueNumber, room: parseInt(roomNumber) }; // แปลงห้องเป็นตัวเลข
        localStorage.setItem('currentQueue', JSON.stringify(queueData));
        console.log("บันทึกคิวปัจจุบันลง LocalStorage:", queueData);
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
                    console.log("อัพเดตคิวปัจจุบันใน DOM:", queueNumber);
                } else {
                    console.error(`ไม่พบ <span> สำหรับห้อง ${roomNumber}`);
                }
            })
            .catch(error => console.error("เกิดข้อผิดพลาดในการดึงหน้าแสดงคิว:", error));
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

            console.log("เรียกคิวใหม่:", nextQueueNumber);

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
        console.log("ล้างคิวทั้งหมด");
        createQueueItems(); // อัพเดตหน้าจอหลังจากล้างคิว
    }

    function createQueueItems() {
        // Update UI elements as needed
        console.log("สร้างรายการห้องเสร็จสิ้น");
    }

    // เริ่มต้นระบบ
    initializeQueue();

    document.getElementById('callQueueButton').addEventListener('click', function() {
        console.log("กดปุ่มเรียกคิวใหม่");
        callNextQueue();
    });

    document.getElementById('clearQueueButton').addEventListener('click', function() {
        console.log("กดปุ่มล้างคิว");
        clearAllQueues();
    });

    addRoomOptions();
});
