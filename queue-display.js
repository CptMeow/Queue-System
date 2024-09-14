new Vue({
  el: '#app',
  data: {
    time: '',
    thaiDate: '',
    rooms: [
      { roomNumber: 1, roomName: 'ห้องตรวจ 3', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFC0CB', colorName: 'สีชมพู' },
      { roomNumber: 2, roomName: 'ห้องตรวจ 4', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#98FB98', colorName: 'สีเขียวอ่อน' },
      { roomNumber: 3, roomName: 'ห้องตรวจ 5', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#87CEEB', colorName: 'สีฟ้าอ่อน' },
      { roomNumber: 4, roomName: 'ห้องตรวจ 6', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFA500', colorName: 'สีส้ม' },
      { roomNumber: 5, roomName: 'ห้องตรวจ 8 โต๊ะ 1', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFFF00', colorName: 'สีเหลือง' },
      { roomNumber: 6, roomName: 'ห้องตรวจ 8 โต๊ะ 2', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#800080', colorName: 'สีม่วง' },
      { roomNumber: 7, roomName: 'ห้องตรวจ 8 โต๊ะ 3', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FF6347', colorName: 'สีมะเขือเทศ' },
      { roomNumber: 8, roomName: 'ห้องตรวจ 10', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FEFEFE', colorName: 'สีขาว' },
      { roomNumber: 9, roomName: 'ห้องตรวจ 11', currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFFFFF', colorName: 'สีขาว' }
    ],
    newQueueRooms: {}, // เก็บสถานะคิวใหม่ของแต่ละห้อง
    isFullScreen: false,
  },
  mounted() {
    this.updateTime(); // โหลดเวลาเริ่มต้น
    this.getCurrentThaiDate();
    setInterval(this.updateTime, 1000); // อัปเดตเวลาใหม่ทุกวินาที

    this.loadQueueData(); // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
    window.addEventListener('storage', this.loadQueueData); // ฟังการเปลี่ยนแปลงของ LocalStorage
  },
  computed: {
    activeRoomsCount() {
      // นับจำนวนห้องที่ active อยู่
      return this.rooms.filter(room => room.isActive).length;
    },
    totalRoomsCount() {
      // นับจำนวนห้องทั้งหมด
      return this.rooms.length;
    }
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
        this.updateRoomVisibility();
      }
    },
    updateRoomVisibility() {
      this.rooms.forEach(room => {
        const roomElement = document.querySelector(`.room-section[data-room-number="${room.roomNumber}"]`);
        if (roomElement) {
          roomElement.style.display = room.isActive ? 'block' : 'none';
        }
      });
    },
    toggleFullScreen() {
      if (!this.isFullScreen) {
        this.openFullScreen();
      } else {
        this.closeFullScreen();
      }
    },
    openFullScreen() {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
      this.isFullScreen = true;
    },
    closeFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari & Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
      this.isFullScreen = false;
    },
    getCurrentThaiDate() {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const currentDate = new Date();
      this.thaiDate = currentDate.toLocaleDateString('th-TH', options);
    },
    getTextSizeClass() {
      if (this.activeRoomsCount <=6) {
        return 'queue-room-count-6'; 
      } else if (this.activeRoomsCount === 7) {
        return 'queue-room-count-7';
      } else if (this.activeRoomsCount === 8) {
        return 'queue-room-count-8';
      }
      return '';
    }
  }
});
