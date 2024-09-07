document.addEventListener('DOMContentLoaded', function() {
    // จำนวนห้อง
    const numberOfRooms = 7;

    // ฟังก์ชันเพื่อสร้างรายการคิวสำหรับแต่ละห้อง
    function createQueueItems() {
        const queueList = document.getElementById('queueList');

        for (let i = 1; i <= numberOfRooms; i++) {
            let queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.id = `room-${i}`;
            queueItem.innerHTML = `<h2>ห้อง ${i}</h2><p>คิวที่รอ: <span id="queue-${i}">0</span></p>`;
            queueList.appendChild(queueItem);
        }
    }

    // เรียกใช้ฟังก์ชันสร้างรายการคิว
    createQueueItems();
});
