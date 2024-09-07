new Vue({
    el: '#app',
    data: {
        currentQueue: 1, // คิวรวมเริ่มต้นที่ 1
        rooms: [
            { roomNumber: 1, calledQueues: [] },
            { roomNumber: 2, calledQueues: [] },
            { roomNumber: 3, calledQueues: [] },
            { roomNumber: 4, calledQueues: [] },
            { roomNumber: 5, calledQueues: [] },
            { roomNumber: 6, calledQueues: [] },
            { roomNumber: 7, calledQueues: [] }
        ],
        selectedRoom: 1, // ห้องที่เลือกสำหรับการเรียกคิว
    },
    mounted() {
        const storedData = JSON.parse(localStorage.getItem('queueData'));
        if (storedData) {
            this.currentQueue = storedData.currentQueue;
            this.rooms = storedData.rooms;
        }
    },
    methods: {
        callNextQueue() {
            const room = this.rooms.find(r => r.roomNumber === this.selectedRoom);
            if (room) {
                room.calledQueues.push(this.currentQueue);
                this.speakQueue(this.currentQueue, room.roomNumber);

                if (room.calledQueues.length > 5) {
                    room.calledQueues.shift(); // เก็บแค่ 5 คิวล่าสุด
                }

                this.currentQueue++;
                this.saveQueueData(); // บันทึกข้อมูลทุกครั้งที่มีการเรียกคิว
            } else {
                alert('ห้องที่เลือกไม่ถูกต้อง');
            }
        },
        resetQueues() {
            if (confirm('คุณแน่ใจหรือไม่ว่าต้องการเริ่มต้นคิวใหม่? การกระทำนี้ไม่สามารถยกเลิกได้')) {
                this.currentQueue = 1;
                this.rooms.forEach(room => {
                    room.calledQueues = [];
                });
                this.saveQueueData();
                alert('คิวถูกรีเซ็ตเรียบร้อยแล้ว!');
            }
        },
        saveQueueData() {
            const data = {
                currentQueue: this.currentQueue,
                rooms: this.rooms
            };
            localStorage.setItem('queueData', JSON.stringify(data));
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
