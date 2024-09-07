document.addEventListener('DOMContentLoaded', function() {
    // จำนวนห้อง
    const numberOfRooms = 7;

    // ฟังก์ชันเพื่อสร้างรายการคิวสำหรับแต่ละห้อง
    function createQueueItems() {
        const queueList = document.getElementById('queueList');
        const currentQueue = loadCurrentQueue();

        for (let i = 1; i <= numberOfRooms; i++) {
            let queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.id = `room-${i}`;

            // จำนวนคิวที่เรียกไปแล้ว
            let calledQueue = localStorage.getItem(`calledQueue-${i}`) || 0;

            queueItem.innerHTML = `
                <h2>ห้อง ${i}</h2>
                <p>คิวปัจจุบัน: ${currentQueue === i ? `<span id="currentQueue-${i}">${currentQueue}</span>` : 'ไม่มี'}</p>
                <p>คิวที่เรียกไปแล้ว: ${calledQueue}</p>
            `;
            queueList.appendChild(queueItem);
        }
    }

    // ฟังก์ชันโหลดคิวปัจจุบันจาก LocalStorage
    function loadCurrentQueue() {
        let savedQueue = localStorage.getItem('currentQueue');
        if (savedQueue) {
            return parseInt(savedQueue, 10);
        }
        return null;
    }

    // ฟังก์ชันอัพเดตคิวที่เรียกไปแล้ว
    function updateCalledQueue(roomNumber) {
        let calledQueue = localStorage.getItem(`calledQueue-${roomNumber}`) || 0;
        calledQueue++;
        localStorage.setItem(`calledQueue-${roomNumber}`, calledQueue);
    }

    // เรียกใช้ฟังก์ชันสร้างรายการคิว
    createQueueItems();

    // ฟังก์ชันเพื่อเรียกคิวใหม่ (ตัวอย่างการอัพเดตคิวที่เรียกไปแล้ว)
    function callNextQueue() {
        const currentQueue = loadCurrentQueue();
        if (currentQueue) {
            let roomNumber = Math.ceil(currentQueue / 10); // ตัวอย่างการเลือกห้องตามหมายเลขคิว
            updateCalledQueue(roomNumber);

            // อัพเดตคิวปัจจุบัน
            localStorage.setItem('currentQueue', currentQueue + 1);
            const newCurrentQueue = currentQueue + 1;
            const queueSpan = document.getElementById(`currentQueue-${roomNumber}`);
            if (queueSpan) {
                queueSpan.innerText = newCurrentQueue;
            }
        }
    }

    // ตัวอย่างการเรียกคิวใหม่
    // callNextQueue();
});
