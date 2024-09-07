// ฟังก์ชันโหลดคิวปัจจุบันจาก LocalStorage
function loadCurrentQueue() {
    let savedQueue = localStorage.getItem('currentQueue');
    if (savedQueue) {
        return parseInt(savedQueue, 10);
    }
    return 1;
}

// ฟังก์ชันบันทึกคิวปัจจุบันลง LocalStorage
function saveCurrentQueue(queueNumber) {
    localStorage.setItem('currentQueue', queueNumber);
}

// โหลดคิวปัจจุบันเมื่อเริ่มต้น
let currentQueueNumber = loadCurrentQueue();
document.getElementById('currentQueue').innerText = currentQueueNumber.toString().padStart(3, '0');

// เพิ่มห้องใหม่
document.getElementById('addRoomBtn').addEventListener('click', function() {
    let roomSelect = document.getElementById('roomSelect');
    let newRoomNumber = roomSelect.options.length + 1;
    let newOption = document.createElement('option');
    newOption.value = newRoomNumber;
    newOption.text = `ห้อง ${newRoomNumber}`;
    roomSelect.appendChild(newOption);
});

// หน้าสำหรับจัดการคิว
if (document.getElementById('nextQueueBtn')) {
    document.getElementById('nextQueueBtn').addEventListener('click', function() {
        currentQueueNumber++;
        let queueStr = currentQueueNumber.toString().padStart(3, '0');
        document.getElementById('currentQueue').innerText = queueStr;
        
        // บันทึกคิวปัจจุบันลงใน LocalStorage
        saveCurrentQueue(currentQueueNumber);

        // เรียกฟังก์ชันออกเสียง
        let selectedRoom = document.getElementById('roomSelect').value;
        announceQueue(queueStr, selectedRoom);
    });
}

// ฟังก์ชันสำหรับออกเสียงคิว (ปรับปรุงเสียง)
function announceQueue(queueNumber, roomNumber) {
    let msg = new SpeechSynthesisUtterance();
    msg.lang = 'th-TH'; // กำหนดให้เป็นภาษาไทย
    msg.text = `ขอเชิญหมายเลข ${queueNumber} ที่ห้อง ${roomNumber}`;

    // ปรับปรุงการออกเสียง (ความเร็วและระดับเสียง)
    msg.rate = 0.9;  // ลดความเร็วการออกเสียง
    msg.pitch = 1;   // ระดับเสียงปกติ

    // ออกเสียง
    window.speechSynthesis.speak(msg);
}

// หน้าสำหรับแสดงผลคิว
setInterval(function() {
    let savedQueue = loadCurrentQueue();
    document.getElementById('currentQueue').innerText = savedQueue.toString().padStart(3, '0');
}, 1000);
