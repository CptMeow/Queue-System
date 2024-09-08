new Vue({
    el: '#app',
    data: {
        time: '',
        currentQueue: 1, // คิวปัจจุบันที่จะเรียก
        rooms: [
            { roomNumber: 1, roomName:'ห้องตรวจ 3', currentQueue: null, calledQueues: [] },
            { roomNumber: 2, roomName:'ห้องตรวจ 4', currentQueue: null, calledQueues: [] },
            { roomNumber: 3, roomName:'ห้องตรวจ 5', currentQueue: null, calledQueues: [] },
            { roomNumber: 4, roomName:'ห้องตรวจ 6', currentQueue: null, calledQueues: [] },
            { roomNumber: 5, roomName:'ห้องตรวจ 8 โต๊ะ 1', currentQueue: null, calledQueues: [] },
            { roomNumber: 6, roomName:'ห้องตรวจ 8 โต๊ะ 2', currentQueue: null, calledQueues: [] },
            { roomNumber: 7, roomName:'ห้องตรวจ 8 โต๊ะ 3', currentQueue: null, calledQueues: [] },
            { roomNumber: 8, roomName:'ห้องตรวจ 10', currentQueue: null, calledQueues: [] },
            { roomNumber: 9, roomName:'ห้องตรวจ 11', currentQueue: null, calledQueues: [] }
        ],
        selectedRoom: 1 // ห้องที่เลือกเรียกคิว
    },
    mounted() {
        this.updateTime(); // Call the method to set initial time
        setInterval(this.updateTime, 1000); // Update time every second
        const storedData = JSON.parse(localStorage.getItem('queueData'));
        if (storedData) {
            this.currentQueue = storedData.currentQueue || this.currentQueue;
            
            // โหลดข้อมูล rooms จาก localStorage หรือถ้าไม่มีข้อมูลให้ใช้ค่าจาก this.rooms
            this.rooms.forEach((room, index) => {
                const storedRoom = storedData.rooms[index];
                if (storedRoom) {
                    room.currentQueue = storedRoom.currentQueue;
                    room.calledQueues = storedRoom.calledQueues;
                }
            });
        }

        // อัปเดตข้อมูลใน localStorage จาก rooms ใหม่ทุกครั้ง
        this.saveQueueData(); 
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
            const message = `เชิญหมายเลข "${queueNumber}" ที่ ${roomName}`;
            const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=${encodeURIComponent(message)}`;

            const audio = new Audio(audioUrl);
            audio.play();
        }
    }
});
