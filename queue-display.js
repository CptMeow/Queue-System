document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7; // จำนวนห้องที่กำหนดไว้ล่วงหน้า

    function createQueueTable() {
        const queueTableBody = document.getElementById('queueTableBody');
        const currentQueue = loadCurrentQueue();

        console.log("โหลดคิวปัจจุบัน:", currentQueue);

        queueTableBody.innerHTML = ''; // ล้างตารางก่อนหน้า

        for (let i = 1; i <= numberOfRooms; i++) {
            let row = document.createElement('tr');

            // จำนวนคิวที่เรียกไปแล้ว
            let calledQueue = localStorage.getItem(`calledQueue-${i}`) || 0;
            console.log(`คิวที่เรียกไปแล้วในห้อง ${i}:`, calledQueue);

            row.innerHTML = `
                <td>ห้อง ${i}</td>
                <td>${currentQueue && currentQueue.room === i ? `<span id="currentQueue-${i}">${currentQueue.queue}</span>` : 'ไม่มี'}</td>
                <td>${calledQueue}</td>
            `;
            queueTableBody.appendChild(row);
        }
        console.log("สร้างตารางคิวเสร็จสิ้น");
    }

    function loadCurrentQueue() {
        let savedQueue = localStorage.getItem('currentQueue');
        if (savedQueue) {
            console.log("คิวที่บันทึกไว้ใน LocalStorage:", savedQueue);
            return JSON.parse(savedQueue);
        }
        console.log("ไม่มีคิวใน LocalStorage");
        return null;
    }

    function clearAllQueues() {
        for (let i = 1; i <= numberOfRooms; i++) {
            localStorage.removeItem(`calledQueue-${i}`);
        }
        localStorage.removeItem('currentQueue');
        console.log("ล้างคิวทั้งหมด");
        createQueueTable(); // อัพเดตหน้าจอหลังจากล้างคิว
    }

    document.getElementById('clearQueueButton').addEventListener('click', function() {
        console.log("กดปุ่มล้างคิว");
        clearAllQueues();
    });

    createQueueTable();
});
