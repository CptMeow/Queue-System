document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7;

    function addRoomOptions() {
        const roomSelect = document.getElementById('roomSelect');
        if (roomSelect) {
            roomSelect.innerHTML = '';

            for (let i = 1; i <= numberOfRooms; i++) {
                let option = document.createElement('option');
                option.value = i;
                option.textContent = `ห้อง ${i}`;
                roomSelect.appendChild(option);
            }
        }
    }

    function initializeQueue() {
        for (let i = 1; i <= numberOfRooms; i++) {
            if (!localStorage.getItem(`calledQueue-${i}`)) {
                localStorage.setItem(`calledQueue-${i}`, 0);
            }
        }
        if (!localStorage.getItem('currentQueue')) {
            localStorage.setItem('currentQueue', JSON.stringify({ queue: 0, room: 1 }));
        }
    }

    function loadCurrentQueue() {
        let savedQueue = localStorage.getItem('currentQueue');
        if (savedQueue) {
            return JSON.parse(savedQueue);
        }
        return { queue: 0, room: 1 }; // ค่าพื้นฐานถ้าไม่มีข้อมูล
    }

    function updateCalledQueue(roomNumber) {
        let calledQueue = parseInt(localStorage.getItem(`calledQueue-${roomNumber}`)) || 0;
        calledQueue++;
        localStorage.setItem(`calledQueue-${roomNumber}`, calledQueue);
    }

    function saveCurrentQueue(queueNumber, roomNumber) {
        const queueData = { queue: queueNumber, room: parseInt(roomNumber) };
        localStorage.setItem('currentQueue', JSON.stringify(queueData));
    }

    function callNextQueue() {
        const roomSelect = document.getElementById('roomSelect');
        const selectedRoom = roomSelect ? roomSelect.value : null;

        if (!selectedRoom) {
            return;
        }

        let currentQueue = loadCurrentQueue();
        let nextQueueNumber = currentQueue.queue + 1;

        // อัพเดตคิวที่เรียกในห้องที่เลือก
        updateCalledQueue(selectedRoom);
        saveCurrentQueue(nextQueueNumber, selectedRoom);

        // เรียกใช้ฟังก์ชันเสียง
        playQueueAudio(nextQueueNumber, selectedRoom);

        // อัพเดตหน้าจอแสดงคิว
        updateQueueDisplays();
    }

    function clearAllQueues() {
        for (let i = 1; i <= numberOfRooms; i++) {
            localStorage.removeItem(`calledQueue-${i}`);
        }
        localStorage.removeItem('currentQueue');

        // อัพเดตหน้าจอแสดงคิวหลังจากล้างคิว
        updateQueueDisplays();
    }

    function playQueueAudio(queueNumber, roomNumber) {
        const text = `เรียกคิว ${queueNumber} ห้อง ${roomNumber}`;
        const utterance = new SpeechSynthesisUtterance(text);

        // กำหนดภาษาที่ใช้
        utterance.lang = 'th-TH'; // ภาษาไทย

        // กำหนดความสูงของเสียงและความเร็วของเสียง
        utterance.pitch = 1; // ความสูงของเสียง
        utterance.rate = 0.8; // ความเร็วของเสียง

        // ค้นหาเสียงที่เป็นผู้หญิง
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('หญิง'));

        // หากพบเสียงที่เป็นผู้หญิง กำหนดให้กับ utterance
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        } else {
            // ถ้าไม่พบเสียงที่เป็นผู้หญิง ให้ใช้เสียงที่ตั้งค่าเริ่มต้น
            console.warn("ไม่พบเสียงผู้หญิงที่กำหนด");
        }

        // เรียกใช้ SpeechSynthesis
        speechSynthesis.speak(utterance);
    }

    function updateQueueDisplays() {
        // สร้างเหตุการณ์ใหม่เพื่อกระตุ้นการอัพเดต
        const event = new Event('storage');
        event.key = `calledQueue-${document.getElementById('roomSelect').value}`;
        window.dispatchEvent(event);
    }

    // เริ่มต้นระบบ
    initializeQueue();

    document.getElementById('callQueueButton').addEventListener('click', function() {
        callNextQueue();
    });

    document.getElementById('clearQueueButton').addEventListener('click', function() {
        clearAllQueues();
    });

    addRoomOptions();
});
