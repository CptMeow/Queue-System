new Vue({
  el: '#app',
  data: {
    time: '',
    rooms: [
      { roomNumber: 1, roomName: 'ห้องตรวจ 3', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFC0CB', colorName: 'ชมพู' },
      { roomNumber: 2, roomName: 'ห้องตรวจ 4', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#98FB98', colorName: 'เขียวอ่อน' },
      { roomNumber: 3, roomName: 'ห้องตรวจ 5', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#87CEEB', colorName: 'ฟ้าอ่อน' },
      { roomNumber: 4, roomName: 'ห้องตรวจ 6', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFFF00', colorName: 'เหลือง' },
      { roomNumber: 5, roomName: 'ห้องตรวจ 8 โต๊ะ 1', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFA500', colorName: 'ส้ม' },
      { roomNumber: 6, roomName: 'ห้องตรวจ 8 โต๊ะ 2', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#800080', colorName: 'ม่วง' },
      { roomNumber: 7, roomName: 'ห้องตรวจ 8 โต๊ะ 3', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FF6347', colorName: 'มะเขือเทศ' },
      { roomNumber: 8, roomName: 'ห้องตรวจ 10', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#D3D3D3', colorName: 'เทาอ่อน' },
      { roomNumber: 9, roomName: 'ห้องตรวจ 11', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#ADD8E6', colorName: 'ฟ้าสว่าง' } // เปลี่ยนสีขาวเป็นสีฟ้าสว่าง
    ]
  },
  mounted() {
    this.updateTime(); // โหลดเวลาเริ่มต้น
    setInterval(this.updateTime, 1000); // อัปเดตเวลาใหม่ทุกวินาที

    this.loadQueueData(); // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
    window.addEventListener('storage', this.loadQueueData); // ฟังการเปลี่ยนแปลงของ LocalStorage
  },
  methods: {
    updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      this.time = `${hours}:${minutes}:${seconds}`;
    },
    loadQueueData() {
      const storedData = JSON.parse(localStorage.getItem('queueData'));
      if (storedData) {
        this.rooms = storedData.rooms || this.rooms;
      }
    },
    callNextQueue(roomNumber) {
      const room = this.rooms.find(r => r.roomNumber === roomNumber);
      if (room && room.isActive) {
        room.currentQueue = room.nextQueue;
        room.calledQueues.push(room.nextQueue);
        room.nextQueue++; // เพิ่มหมายเลขคิวถัดไป

        if (room.calledQueues.length > 5) {
          room.calledQueues.shift(); // จำกัดจำนวนคิวที่เก็บไว้ใน calledQueues ให้ไม่เกิน 5
        }

        this.saveQueueData();
        this.speakQueue(room.currentQueue, room.roomNumber, room.roomName, room.rgbColor); // เล่นเสียงเรียกคิว
      }
    },
    resetRoomQueue(roomNumber) {
      const room = this.rooms.find(r => r.roomNumber === roomNumber);
      if (room && room.isActive && confirm(`คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตคิวสำหรับห้อง ${room.roomName}?`)) {
        room.currentQueue = null;
        room.nextQueue = 1;
        room.calledQueues = [];
        this.saveQueueData();
        alert(`คิวสำหรับห้อง ${room.roomName} ถูกรีเซ็ตเรียบร้อยแล้ว!`);
      }
    },
    resetAllQueues() {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างคิวทุกห้อง?')) {
        this.rooms.forEach(room => {
          room.currentQueue = null;
          room.nextQueue = 1;
          room.calledQueues = [];
        });
        this.saveQueueData();
        alert('คิวทุกห้องถูกล้างเรียบร้อยแล้ว!');
      }
    },
    reCallLastQueue(roomNumber) {
      const room = this.rooms.find(r => r.roomNumber === roomNumber);
      if (room && room.isActive && room.calledQueues.length) {
        const lastQueue = room.calledQueues[room.calledQueues.length - 1];
        room.currentQueue = lastQueue;
        this.speakQueue(lastQueue, room.roomNumber, room.roomName, room.rgbColor); // เล่นเสียงเรียกคิว
        this.saveQueueData();
      }
    },
    reCallQueue(roomNumber, queueNumber) {
      const room = this.rooms.find(r => r.roomNumber === roomNumber);
      if (room && room.isActive) {
        room.currentQueue = queueNumber;
        this.speakQueue(queueNumber, room.roomNumber, room.roomName, room.rgbColor); // เล่นเสียงเรียกคิว
        this.saveQueueData();
      }
    },
    saveQueueData() {
      const data = {
        rooms: this.rooms
      };
      localStorage.setItem('queueData', JSON.stringify(data));
    },
    speakQueue(queueNumber, roomNumber, roomName, rgbColor) {
      const colorName = this.rooms.find(r => r.rgbColor === rgbColor).colorName || 'สีไม่รู้จัก';
      let message = `เชิญบัตรคิวสี${colorName} หมายเลข ${queueNumber} ที่ ${roomName}`;
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=${encodeURIComponent(message)}`;
      const audio = new Audio(audioUrl);
      audio.play();
    },
    toggleRoomStatus(roomNumber) {
      const room = this.rooms.find(r => r.roomNumber === roomNumber);
      if (room) {
        room.isActive = !room.isActive;
        this.saveQueueData();
      }
    },
    clearAllData() {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? ข้อมูลทั้งหมดจะถูกลบออกและไม่สามารถกู้คืนได้!')) {
        localStorage.removeItem('queueData');
        this.rooms.forEach(room => {
          room.currentQueue = null;
          room.nextQueue = 1;
          room.calledQueues = [];
        });
        this.saveQueueData();
        alert('ข้อมูลทั้งหมดถูกล้างเรียบร้อยแล้ว!');
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.loadQueueData); // ลบ event listener เมื่อ component ถูกทำลาย
  }
});
