new Vue({
  el: '#app',
  data: {
    rooms: [
      { roomNumber: 1, currentQueue: null, calledQueues: [] },
      { roomNumber: 2, currentQueue: null, calledQueues: [] },
      { roomNumber: 3, currentQueue: null, calledQueues: [] },
      { roomNumber: 4, currentQueue: null, calledQueues: [] },
      { roomNumber: 5, currentQueue: null, calledQueues: [] },
      { roomNumber: 6, currentQueue: null, calledQueues: [] },
      { roomNumber: 7, currentQueue: null, calledQueues: [] }
    ]
  },
  mounted() {
    this.updateQueueData(); // โหลดข้อมูลครั้งแรก
    window.addEventListener('storage', this.updateQueueData); // ฟังการเปลี่ยนแปลงของ LocalStorage
  },
  methods: {
    updateQueueData() {
      const storedData = JSON.parse(localStorage.getItem('queueData'));
      if (storedData) {
        this.rooms = storedData.rooms || this.rooms;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.updateQueueData); // ลบ event listener เมื่อ component ถูกทำลาย
  }
});
