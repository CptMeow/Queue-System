const maxRecentQueues = 5;

function updateCalledQueue(roomNumber) {
    let queues = JSON.parse(localStorage.getItem(`calledQueue-${roomNumber}`)) || [];

    if (!Array.isArray(queues)) {
        queues = [];
    }

    const currentQueueNumber = queues.length + 1;
    queues.push(`คิว ${currentQueueNumber}`); // เพิ่มคิวใหม่

    if (queues.length > maxRecentQueues) {
        queues.shift(); // ลบคิวเก่าที่สุดเมื่อถึงจำนวนสูงสุด
    }

    localStorage.setItem(`calledQueue-${roomNumber}`, JSON.stringify(queues));
}

function saveCurrentQueue(queueNumber, roomNumber) {
    const queueData = { queue: queueNumber, room: roomNumber };
    localStorage.setItem('currentQueue', JSON.stringify(queueData));
}

function callNextQueue(roomNumber) {
    let currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
    const queueNumber = (currentQueue.queue || 0) + 1;

    saveCurrentQueue(queueNumber, roomNumber);
    updateCalledQueue(roomNumber);

    // อัปเดตหน้าจอรอคิว
    updateQueueDisplay();
}

function updateQueueDisplay() {
    // ทำให้แน่ใจว่าฟังก์ชันนี้อัปเดตหน้าจอการแสดงผล
    // คุณอาจต้องเขียนฟังก์ชันนี้เพื่อรีเฟรชข้อมูลในหน้า queue-display.html
}

document.addEventListener('DOMContentLoaded', function() {
    const callQueueButtons = document.querySelectorAll('.call-queue-button');

    callQueueButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roomNumber = this.dataset.room;
            callNextQueue(roomNumber);
        });
    });

    const clearQueuesButton = document.getElementById('clearQueuesButton');
    if (clearQueuesButton) {
        clearQueuesButton.addEventListener('click', function() {
            for (let i = 1; i <= 7; i++) {
                localStorage.removeItem(`calledQueue-${i}`);
            }
            localStorage.removeItem('currentQueue');
            updateQueueDisplay(); // อัปเดตหน้าจอการแสดงผลหลังการล้าง
        });
    }
});
