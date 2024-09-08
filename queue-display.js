new Vue({
  el: '#app',
  data: {
    time: '',
    rooms: [
      { roomNumber: 1, roomName: 'ห้องตรวจ 3', currentQueue: null, nextQueue: 1 },
      { roomNumber: 2, roomName: 'ห้องตรวจ 4', currentQueue: null, nextQueue: 1 },
      { roomNumber: 3, roomName: 'ห้องตรวจ 5', currentQueue: null, nextQueue: 1 },
      { roomNumber: 4, roomName: 'ห้องตรวจ 6', currentQueue: null, nextQueue: 1 },
      { roomNumber: 5, roomName: 'ห้องตรวจ 8 โต๊ะ 1', currentQueue: null, nextQueue: 1 },
      { roomNumber: 6, roomName: 'ห้องตรวจ 8 โต๊ะ 2', currentQueue: null, nextQueue: 1 },
      { roomNumber: 7, roomName: 'ห้องตรวจ 8 โต๊ะ 3', currentQueue: null, nextQueue: 1 },
      { roomNumber: 8, roomName: 'ห้องตรวจ 10', currentQueue: null, nextQueue: 1 },
      { roomNumber: 9, roomName: 'ห้องตรวจ 11', currentQueue: null, nextQueue: 1 }
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
    }
  }
});
