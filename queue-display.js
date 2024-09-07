document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7;

    function createQueueItems() {
        const tableBody = document.getElementById('queueTableBody');
        if (tableBody) {
            tableBody.innerHTML = '';

            for (let i = 1; i <= numberOfRooms; i++) {
                let row = document.createElement('tr');

                let roomCell = document.createElement('td');
                roomCell.textContent = `ห้อง ${i}`;
                row.appendChild(roomCell);

                let queueCell = document.createElement('td');
                let queueSpan = document.createElement('span');
                queueSpan.id = `currentQueue-${i}`;
                queueCell.appendChild(queueSpan);
                row.appendChild(queueCell);

                tableBody.appendChild(row);

                let currentQueue = loadCurrentQueue();
                if (currentQueue && currentQueue.room === i) {
                    queueSpan.textContent = currentQueue.queue;
                } else {
                    queueSpan.textContent = 'ไม่มีคิว';
                }
            }
        } else {
            console.error("ไม่พบ tbody สำหรับตารางคิว");
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

    // สร้างรายการห้องเมื่อโหลดหน้า
    createQueueItems();
    updateQueueDisplays(); // เพิ่มการเรียกใช้เพื่อให้แน่ใจว่าหน้าจอได้รับการอัพเดต
});
