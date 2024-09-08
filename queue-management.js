new Vue({
  el: '#app',
  data: {
    time: '',
    rooms: [
      { roomNumber: 1, roomName: 'ห้องตรวจ 3', currentQueue: null, nextQueue: 1, calledQueues: [] },
      { roomNumber: 2, roomName: 'ห้องตรวจ 4', currentQueue: null, nextQueue: 1, calledQueues: [] },
      { roomNumber: 3, roomName: 'ห้องตรวจ 5', currentQueue: null, nextQueue: 1, calledQueues: [] },
      { roomNumber: 4, roomName: 'ห้องตรวจ 6', currentQueue: null, nextQueue: 1, calledQueues: [] },
      { roomNumber: 5, roomName: 'ห้องตรวจ 8 โต๊ะ 1', currentQueue: null, nextQueue: 1, calledQueues: [] },
      { roomNumber: 6, roomName: 'ห้องตรวจ 8 โต๊ะ 2', currentQueue: null, nextQueue: 1, calledQueues: [] },
      { roomNumber: 7, roomName: 'ห้องตรวจ 8 โต๊ะ 3', currentQueue: null, nextQueue: 1, calledQueues: [] },
      { roomNumber: 8, roomName: 'ห้องตรวจ 10', currentQueue: null, nextQueue: 1, calledQueues: [] },
      { roomNumber: 9, roomName: 'ห้องตรวจ 11', currentQueue: null, nextQueue: 1, calledQueues: [] }
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
      if (room) {
        room.currentQueue = room.nextQueue;
        room.calledQueues.push(room.nextQueue);
        room.nextQueue++; // เพิ่มหมายเลขคิวถัดไป

        if (room.calledQueues.length > 5) {
          room.calledQueues.shift(); // จำกัดจำนวนคิวที่เก็บไว้ใน calledQueues ให้ไม่เกิน 5
        }

        this.saveQueueData();
        this.speakQueue(room.currentQueue, room.roomNumber, room.roomName); // เล่นเสียงเรียกคิว
      }
    },
    resetRoomQueue(roomNumber) {
      const room = this.rooms.find(r => r.roomNumber === roomNumber);
      if (room && confirm(`คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตคิวสำหรับห้อง ${room.roomName}?`)) {
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
    saveQueueData() {
      const data = {
        rooms: this.rooms
      };
      localStorage.setItem('queueData', JSON.stringify(data));
    },
    speakQueue(queueNumber, roomNumber, roomName) {
      
      if(roomNumber == 1) {
        const message = `เชิญบัตรคิวสีชมพูหมายเลข ${queueNumber} ที่ ${roomName}`;
      }
      else {
        const message = `เชิญบัตรคิวสีฟ้าหมายเลข ${queueNumber} ที่ ${roomName}`;
      }
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=${encodeURIComponent(message)}`;
      const audio = new Audio(audioUrl);
      audio.play();
    }
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.loadQueueData); // ลบ event listener เมื่อ component ถูกทำลาย
  }
});
