new Vue({
    el: '#app',
    data: {
        time: '',
        currentQueue: 1, // คิวปัจจุบันที่จะเรียก
        rooms: [
            { roomNumber: 1, roomName:'3', currentQueue: null, calledQueues: [] },
            { roomNumber: 2, roomName:'4', currentQueue: null, calledQueues: [] },
            { roomNumber: 3, roomName:'5', currentQueue: null, calledQueues: [] },
            { roomNumber: 4, roomName:'6', currentQueue: null, calledQueues: [] },
            { roomNumber: 5, roomName:'8', currentQueue: null, calledQueues: [] },
            { roomNumber: 6, roomName:'10', currentQueue: null, calledQueues: [] },
            { roomNumber: 7, roomName:'11', currentQueue: null, calledQueues: [] }
        ],
        selectedRoom: 1 // ห้องที่เลือกเรียกคิว
    },
    mounted() {
        this.updateTime(); // Call the method to set initial time
        setInterval(this.updateTime, 1000); // Update time every second
        const storedData = JSON.parse(localStorage.getItem('queueData'));
        if (storedData) {
            this.currentQueue = storedData.currentQueue;
            // ตรวจสอบว่ามีฟิลด์ roomName หรือไม่ ถ้าไม่มี ให้เพิ่มจากค่าเริ่มต้นใน rooms
            storedData.rooms.forEach((storedRoom, index) => {
                if (!storedRoom.roomName) {
                    storedRoom.roomName = this.rooms[index].roomName;
                }
            });
            this.rooms = storedData.rooms;
        }
    },
    methods: {
        updateTime() {
      this.time = this.getCurrentTime();
    },
         getCurrentTime() {
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          return `${hours}:${minutes}:${seconds}`;
        },
        callNextQueue() {
            const room = this.rooms.find(r => r.roomNumber === this.selectedRoom);
            if (room) {
                console.log('ROOM',room);
                room.calledQueues.push(this.currentQueue);
                room.currentQueue = this.currentQueue; // ตั้งคิวปัจจุบันเป็นหมายเลขคิวถัดไป
                this.speakQueue(this.currentQueue, room.roomName);

                if (room.calledQueues.length > 5) {
                    room.calledQueues.shift(); // เก็บแค่ 5 คิวล่าสุด
                }

                this.currentQueue++; // เพิ่มหมายเลขคิวถัดไป
                this.saveQueueData();

                // Dispatch storage event manually to trigger updates on queue display
                window.dispatchEvent(new Event('storage'));
            } else {
                alert('ห้องที่เลือกไม่ถูกต้อง');
            }
        },
        resetQueues() {
            if (confirm('คุณแน่ใจหรือไม่ว่าต้องการเริ่มต้นคิวใหม่?')) {
                this.currentQueue = 1;
                this.rooms.forEach(room => {
                    room.calledQueues = [];
                    room.currentQueue = null;
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
        speakQueue(queueNumber, roomName) {
            const message = `เชิญหมายเลข  ${queueNumber}  ที่ ห้องตรวจ  ${roomName}`;
            const speech = new SpeechSynthesisUtterance(message);
            speech.lang = 'th-TH';
            speech.rate = 0.7; // ปรับความเร็วเสียงให้พูดช้าลง
            window.speechSynthesis.speak(speech);
        }
    }
});
