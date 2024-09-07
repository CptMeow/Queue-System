// ฟังก์ชันสำหรับออกเสียงคิว
function announceQueue(queueNumber, roomNumber) {
    let msg = new SpeechSynthesisUtterance();
    msg.lang = 'th-TH'; // กำหนดให้เป็นภาษาไทย

    // ตรวจสอบว่า Web Speech API สามารถใช้งานได้หรือไม่
    if ('speechSynthesis' in window) {
        // ตรวจสอบการโหลดเสียง
        window.speechSynthesis.onvoiceschanged = () => {
            let voices = window.speechSynthesis.getVoices();
            let thaiVoice = voices.find(voice => voice.lang === 'th-TH');

            if (thaiVoice) {
                msg.voice = thaiVoice;
            }

            // ตั้งข้อความที่ต้องการออกเสียง
            msg.text = `ขอเชิญหมายเลข ${queueNumber} ที่ห้อง ${roomNumber}`;

            // ปรับปรุงการออกเสียง (ความเร็วและระดับเสียง)
            msg.rate = 0.9;  // ลดความเร็วการออกเสียง
            msg.pitch = 1;   // ระดับเสียงปกติ

            // ออกเสียง
            window.speechSynthesis.speak(msg);
        };
    } else {
        console.error("Web Speech API ไม่สามารถใช้งานได้ในเบราว์เซอร์นี้");
    }
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
