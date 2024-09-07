new Vue({
  el: '#app',
  data: {
    time: '',  // Initialize time as an empty string
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
    this.updateTime(); // Call the method to set initial time
    setInterval(this.updateTime, 1000); // Update time every second
    this.loadQueueData();
    window.addEventListener('storage', this.loadQueueData);
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
    loadQueueData() {
      const storedData = JSON.parse(localStorage.getItem('queueData'));
      if (storedData) {
        this.rooms.forEach(room => {
          const roomData = storedData.rooms.find(r => r.roomNumber === room.roomNumber);
          if (roomData) {
            room.currentQueue = roomData.currentQueue;
            room.calledQueues = roomData.calledQueues;
          }
        });
      }
    }
  }
});
