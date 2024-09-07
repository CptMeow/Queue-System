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

// ฟังก์ชันล้างคิว
function clearQueue() {
    currentQueueNumber = 1; // รีเซ็ตคิวกลับไปที่ 1
    document.getElementById('currentQueue').innerText = currentQueueNumber.toString().padStart(3, '0');
    saveCurrentQueue(currentQueueNumber);
}

// ฟังก์ชันสร้างปุ่มเรียกคิวสำหรับแต่ละห้อง
function createQueueButtons() {
    const buttonsContainer = document.getElementById('buttonsContainer');
    const roomSelect = document.getElementById('roomSelect');

    for (let i = 1; i <= 7; i++) {
        let button = document.createElement('button');
        button.textContent = `เรียกคิวสำหรับห้อง ${i}`;
        button.dataset.room = i;
        button.addEventListener('click', function() {
            let queueStr = currentQueueNumber.toString().padStart(3, '0');
            document.getElementById('currentQueue').innerText = queueStr;

            // บันทึกคิวปัจจุบันลงใน LocalStorage
            saveCurrentQueue(currentQueueNumber);

            // เรียกฟังก์ชันออกเสียง
            announceQueue(queueStr, button.dataset.room);
            
            // เพิ่มคิว
            currentQueueNumber++;
        });
        buttonsContainer.appendChild(button);
    }
}

// ฟังก์ชันสำหรับออกเสียงคิว
function announceQueue(queueNumber, roomNumber) {
    if (!('speechSynthesis' in window)) {
        console.error("Web Speech API ไม่สามารถใช้งานได้ในเบราว์เซอร์นี้");
        return;
    }
    
    let msg = new SpeechSynthesisUtterance();
    msg.lang = 'th-TH'; // กำหนดให้เป็นภาษาไทย

    // ตั้งข้อความที่ต้องการออกเสียง
    msg.text = `ขอเชิญหมายเลข ${queueNumber} ที่ห้อง ${roomNumber}`;

    // ปรับปรุงการออกเสียง (ความเร็วและระดับเสียง)
    msg.rate = 0.9;  // ลดความเร็วการออกเสียง
    msg.pitch = 1;   // ระดับเสียงปกติ

    // ตรวจสอบและเลือกเสียงภาษาไทย
    const voices = window.speechSynthesis.getVoices();
    let thaiVoice = voices.find(voice => voice.lang === 'th-TH');
    if (thaiVoice) {
        msg.voice = thaiVoice;
    }

    // ออกเสียง
    window.speechSynthesis.speak(msg);
}

// ฟังก์ชันโหลดเสียงภาษาไทยให้พร้อมใช้งาน
window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    let thaiVoice = voices.find(voice => voice.lang === 'th-TH');
    if (thaiVoice) {
        console.log("พบเสียงภาษาไทย:", thaiVoice.name);
    } else {
        console.log("ไม่พบเสียงภาษาไทยในระบบนี้");
    }
};

// เริ่มต้นเมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    currentQueueNumber = loadCurrentQueue();
    document.getElementById('currentQueue').innerText = currentQueueNumber.toString().padStart(3, '0');

    createQueueButtons();

    // ปุ่มล้างคิว
    const clearQueueBtn = document.getElementById('clearQueueBtn');
    if (clearQueueBtn) {
        clearQueueBtn.addEventListener('click', function() {
            clearQueue();
        });
    }
});
