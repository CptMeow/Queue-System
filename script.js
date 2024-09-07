// ฟังก์ชันสำหรับออกเสียงคิว
function announceQueue(queueNumber, roomNumber) {
    let msg = new SpeechSynthesisUtterance();
    msg.lang = 'th-TH'; // กำหนดให้เป็นภาษาไทย

    // ตั้งข้อความที่ต้องการออกเสียง
    msg.text = `ขอเชิญหมายเลข ${queueNumber} ที่ห้อง ${roomNumber}`;

    // ปรับปรุงการออกเสียง (ความเร็วและระดับเสียง)
    msg.rate = 0.9;  // ลดความเร็วการออกเสียง
    msg.pitch = 1;   // ระดับเสียงปกติ

    // ตรวจสอบและเลือกเสียงภาษาไทย
    const voices = window.speechSynthesis.getVoices();
    let thaiVoice = voices.find(voice => voice.lang === 'th-TH'); // ค้นหาเสียงภาษาไทย

    if (thaiVoice) {
        msg.voice = thaiVoice; // ตั้งค่าเสียงภาษาไทย
    }

    // ออกเสียง
    window.speechSynthesis.speak(msg);
}

// โหลดเสียงภาษาไทยให้พร้อมใช้งาน
window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    let thaiVoice = voices.find(voice => voice.lang === 'th-TH');
    if (thaiVoice) {
        console.log("พบเสียงภาษาไทย:", thaiVoice.name);
    } else {
        console.log("ไม่พบเสียงภาษาไทยในระบบนี้");
    }
};
