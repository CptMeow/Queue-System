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
                queueSpan.textContent = 'ไม่มีคิว'; // ค่าเริ่มต้น
                queueCell.appendChild(queueSpan);
                row.appendChild(queueCell);

                tableBody.appendChild(row);
            }
        } else {
            console.error("ไม่พบ tbody สำหรับตารางคิว");
        }
        updateQueueDisplays();
    }

    function updateQueueDisplays() {
        for (let i = 1; i <= numberOfRooms; i++) {
            let queueSpan = document.getElementById(`currentQueue-${i}`);
            if (queueSpan) {
                let calledQueue = localStorage.getItem(`calledQueue-${i}`);
                queueSpan.textContent = calledQueue ? calledQueue : 'ไม่มีคิว';
            } else {
                console.error(`ไม่พบ <span> สำหรับห้อง ${i}`);
            }
        }
    }

    // ตรวจสอบการเปลี่ยนแปลงใน localStorage
    window.addEventListener('storage', function(event) {
        if (event.key && event.key.startsWith('calledQueue-')) {
            updateQueueDisplays();
        }
    });

    // สร้างรายการห้องเมื่อโหลดหน้า
    createQueueItems();
});
