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
    this.loadQueueData();
    window.addEventListener('storage', this.loadQueueData);
  },
  methods: {
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
