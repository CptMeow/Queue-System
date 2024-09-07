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

// หน้าสำหรับจัดการคิว
if (document.getElementById('nextQueueBtn')) {
    document.getElementById('nextQueueBtn').addEventListener('click', function() {
        currentQueueNumber++;
        let queueStr = currentQueueNumber.toString().padStart(3, '0');
        document.getElementById('currentQueue').innerText = queueStr;
        
        // บันทึกคิวปัจจุบันลงใน LocalStorage
        saveCurrentQueue(currentQueueNumber);

        // เรียกฟังก์ชันออกเสียง
        announceQueue(queueStr);
    });
}

// ฟังก์ชันสำหรับออกเสียงคิว
function announceQueue(queueNumber) {
    let msg = new SpeechSynthesisUtterance();
    msg.lang = 'th-TH'; // กำหนดให้เป็นภาษาไทย
    msg.text = 'ขอเชิญหมายเลข ' + queueNumber + ' ที่ช่องบริการ';

    // ออกเสียง
    window.speechSynthesis.speak(msg);
}

// หน้าสำหรับแสดงผลคิว
setInterval(function() {
    let savedQueue = loadCurrentQueue();
    document.getElementById('currentQueue').innerText = savedQueue.toString().padStart(3, '0');
}, 1000);
