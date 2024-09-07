document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7; // จำนวนห้องที่กำหนดไว้ล่วงหน้า

    // ฟังก์ชันเพื่อเพิ่มห้อง
    function addRoom() {
        const roomSelect = document.getElementById('roomSelect');
        roomSelect.innerHTML = ''; // ล้างตัวเลือกห้องก่อนหน้า

        for (let i = 1; i <= numberOfRooms; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.textContent = `ห้อง ${i}`;
            roomSelect.appendChild(option);
        }
        console.log("เพิ่มตัวเลือกห้องใน select box:", numberOfRooms);
    }

    // ฟังก์ชันเพื่อสร้างรายการคิวสำหรับแต่ละห้อง
    function createQueueItems() {
        const queueList = document.getElementById('queueList');
        const currentQueue = loadCurrentQueue();

        console.log("โหลดคิวปัจจุบัน:", currentQueue);

        queueList.innerHTML = ''; // ล้างรายการคิวก่อนหน้า

        for (let i = 1; i <= numberOfRooms; i++) {
            let queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.id = `room-${i}`;

            // จำนวนคิวที่เรียกไปแล้ว
            let calledQueue = localStorage.getItem(`calledQueue-${i}`) || 0;
            console.log(`คิวที่เรียกไปแล้วในห้อง ${i}:`, calledQueue);

            queueItem.innerHTML = `
                <h2>ห้อง ${i}</h2>
                <p>คิวปัจจุบัน: ${currentQueue && currentQueue.room === i ? `<span id="currentQueue-${i}">${currentQueue.queue}</span>` : 'ไม่มี'}</p>
                <p>คิวที่เรียกไปแล้ว: ${calledQueue}</p>
            `;
            queueList.appendChild(queueItem);
        }
        console.log("สร้างรายการคิวเสร็จสิ้น");
    }

    // ฟังก์ชันโหลดคิวปัจจุบันจาก LocalStorage
    function loadCurrentQueue() {
        let savedQueue = localStorage.getItem('currentQueue');
        if (savedQueue) {
            console.log("คิวที่บันทึกไว้ใน LocalStorage:", savedQueue);
            return JSON.parse(savedQueue);
        }
        console.log("ไม่มีคิวใน LocalStorage");
        return null;
    }

    // ฟังก์ชันบันทึกคิวปัจจุบันลง LocalStorage
    function saveCurrentQueue(queueNumber, roomNumber) {
        const queueData = { queue: queueNumber, room: roomNumber };
        localStorage.setItem('currentQueue', JSON.stringify(queueData));
        console.log("บันทึกคิวปัจจุบันลง LocalStorage:", queueData);
    }

    // ฟังก์ชันอัพเดตคิวที่เรียกไปแล้ว
    function updateCalledQueue(roomNumber) {
        let calledQueue = localStorage.getItem(`calledQueue-${roomNumber}`) || 0;
        console.log(`อัพเดตคิวที่เรียกไปแล้วในห้อง ${roomNumber}:`, calledQueue);
        calledQueue++;
        localStorage.setItem(`calledQueue-${roomNumber}`, calledQueue);
        console.log(`คิวที่เรียกไปแล้วในห้อง ${roomNumber} หลังจากอัพเดต:`, calledQueue);
    }

    // ฟังก์ชันเพื่อเรียกคิวใหม่
    function callNextQueue() {
        const currentQueue = loadCurrentQueue();
        if (currentQueue) {
            let nextQueueNumber = currentQueue.queue + 1;
            let nextRoomNumber = Math.ceil(nextQueueNumber / 10); // ตัวอย่างการเลือกห้องตามหมายเลขคิว

            console.log("เรียกคิวสำหรับห้อง:", nextRoomNumber);

            updateCalledQueue(nextRoomNumber);

            // อัพเดตคิวปัจจุบัน
            saveCurrentQueue(nextQueueNumber, nextRoomNumber);
            const newCurrentQueue = nextQueueNumber;
            console.log("คิวปัจจุบันใหม่:", newCurrentQueue);

            const queueSpan = document.getElementById(`currentQueue-${nextRoomNumber}`);
            if (queueSpan) {
                queueSpan.innerText = newCurrentQueue;
                console.log("อัพเดตคิวปัจจุบันใน DOM:", newCurrentQueue);
            } else {
                console.log(`ไม่พบ <span> สำหรับห้อง ${nextRoomNumber}`);
            }
        } else {
            console.log("ไม่มีคิวปัจจุบันในการเรียก");
        }
    }

    // ฟังก์ชันล้างคิวทั้งหมด
    function clearAllQueues() {
        for (let i = 1; i <= numberOfRooms; i++) {
            localStorage.removeItem(`calledQueue-${i}`);
        }
        localStorage.removeItem('currentQueue');
        console.log("ล้างคิวทั้งหมด");
        createQueueItems(); // อัพเดตหน้าจอหลังจากล้างคิว
    }

    // ตรวจสอบและติดตั้ง Event Listener
    document.getElementById('callQueueButton').addEventListener('click', function() {
        console.log("กดปุ่มเรียกคิวใหม่");
        callNextQueue();
    });

    document.getElementById('clearQueueButton').addEventListener('click', function() {
        console.log("กดปุ่มล้างคิว");
        clearAllQueues();
    });

    // เรียกใช้ฟังก์ชันเพิ่มห้องและสร้างรายการคิว
    addRoom();
    createQueueItems();
});
