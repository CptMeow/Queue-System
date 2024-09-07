new Vue({
    el: '#app',
    data: {
        time: '',
        currentQueue: 1, // คิวปัจจุบันที่จะเรียก
        rooms: [
                { roomNumber: 1, currentQueue: null, calledQueues: [] },
              { roomNumber: 2, currentQueue: null, calledQueues: [] },
              { roomNumber: 3, currentQueue: null, calledQueues: [] },
              { roomNumber: 4, currentQueue: null, calledQueues: [] },
              { roomNumber: 5, currentQueue: null, calledQueues: [] },
              { roomNumber: 6, currentQueue: null, calledQueues: [] },
              { roomNumber: 7, currentQueue: null, calledQueues: [] }
        ],
        selectedRoom: 1 // ห้องที่เลือกเรียกคิว
    },
    mounted() {
        this.updateTime(); // Call the method to set initial time
        setInterval(this.updateTime, 1000); // Update time every second
        const storedData = JSON.parse(localStorage.getItem('queueData'));
        if (storedData) {
            this.currentQueue = storedData.currentQueue;
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
                room.calledQueues.push(this.currentQueue);
                room.currentQueue = this.currentQueue; // ตั้งคิวปัจจุบันเป็นหมายเลขคิวถัดไป
                this.speakQueue(this.currentQueue, room.roomNumber);

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
        speakQueue(queueNumber, roomNumber) {
            const message = `เชิญหมายเลข ${queueNumber} ที่ห้อง ${roomNumber}`;
            const speech = new SpeechSynthesisUtterance(message);
            speech.lang = 'th-TH';
            speech.rate = 0.8; // ปรับความเร็วเสียงให้พูดช้าลง
            window.speechSynthesis.speak(speech);
        }
    }
});
