new Vue({
    el: '#app',
    data: {
        rooms: [
            { roomNumber: 1, roomName:'3', currentQueue: 1, calledQueues: [] },
            { roomNumber: 2, roomName:'4', currentQueue: 1, calledQueues: [] },
            { roomNumber: 3, roomName:'5', currentQueue: 1, calledQueues: [] },
            { roomNumber: 4, roomName:'6', currentQueue: 1, calledQueues: [] },
            { roomNumber: 5, roomName:'8/1', currentQueue: 1, calledQueues: [] },
            { roomNumber: 6, roomName:'10', currentQueue: 1, calledQueues: [] },
            { roomNumber: 7, roomName:'11', currentQueue: 1, calledQueues: [] }
        ],
        selectedRoom: 1,
    },
    mounted() {
        // โหลดข้อมูลคิวจาก LocalStorage เมื่อโหลดหน้าเว็บใหม่
        const storedRooms = JSON.parse(localStorage.getItem('rooms'));
        if (storedRooms) {
            this.rooms = storedRooms;
        }
    },
    methods: {
        callNextQueue() {
            const room = this.rooms.find(r => r.roomNumber === this.selectedRoom);
            console.log(room);
            if (room) {
                room.calledQueues.push(room.currentQueue);
                this.speakQueue(room.currentQueue, room.roomName);

                if (room.calledQueues.length > 5) {
                    room.calledQueues.shift(); // เก็บแค่ 5 คิวล่าสุด
                }
                room.currentQueue++;
                // บันทึกข้อมูลคิวลง LocalStorage
                localStorage.setItem('rooms', JSON.stringify(this.rooms));
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
                localStorage.setItem('rooms', JSON.stringify(this.rooms));
                alert('คิวถูกรีเซ็ตเรียบร้อยแล้ว!');
            }
        },
        speakQueue(queueNumber, roomName) {
            const message = `เชิญหมายเลข ${queueNumber} ที่ห้อง ${roomName}`;
            const speech = new SpeechSynthesisUtterance(message);
            speech.lang = 'th-TH';
            speech.rate = 0.8; // ปรับความเร็วเสียงให้อยู่ในระดับที่ช้าลง
            window.speechSynthesis.speak(speech);
        }
    }
});
