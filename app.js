new Vue({
    el: '#app',
    data: {
        rooms: [
            { roomNumber: 1, currentQueue: 1, calledQueues: [] },
            { roomNumber: 2, currentQueue: 1, calledQueues: [] },
            { roomNumber: 3, currentQueue: 1, calledQueues: [] },
            { roomNumber: 4, currentQueue: 1, calledQueues: [] },
            { roomNumber: 5, currentQueue: 1, calledQueues: [] },
            { roomNumber: 6, currentQueue: 1, calledQueues: [] },
            { roomNumber: 7, currentQueue: 1, calledQueues: [] }
        ],
        selectedRoom: 1,
        message: '',
    },
    methods: {
        callNextQueue() {
            const room = this.rooms.find(r => r.roomNumber === this.selectedRoom);
            if (room) {
                room.calledQueues.push(room.currentQueue);
                this.speakQueue(room.currentQueue, room.roomNumber);

                if (room.calledQueues.length > 5) {
                    room.calledQueues.shift(); // เก็บแค่ 5 คิวล่าสุด
                }
                room.currentQueue++;
            } else {
                alert('ห้องที่เลือกไม่ถูกต้อง');
            }
        },
        resetQueues() {
            if (confirm('คุณแน่ใจหรือไม่ว่าต้องการเริ่มต้นคิวใหม่? การกระทำนี้ไม่สามารถยกเลิกได้')) {
                this.rooms.forEach(room => {
                    room.currentQueue = 1;
                    room.calledQueues = [];
                });
                alert('คิวถูกรีเซ็ตเรียบร้อยแล้ว!');
            }
        },
        speakQueue(queueNumber, roomNumber) {
            const message = `เชิญหมายเลข ${queueNumber} ที่ห้อง ${roomNumber}`;
            const speech = new SpeechSynthesisUtterance(message);
            speech.lang = 'th-TH';
            speech.rate = 0.8; // ปรับความเร็วเสียงให้อยู่ในระดับที่ช้าลง
            window.speechSynthesis.speak(speech);
        }
    }
});
