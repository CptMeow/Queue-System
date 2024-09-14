// Initialize Awesome Notifications
const AwesomeNotifications = window.AwesomeNotifications || {};

AwesomeNotifications.createNotification = function(options) {
    // Assuming Awesome Notifications is available
    if (typeof AwesomeNotifications.show === 'function') {
        AwesomeNotifications.show(options);
    } else {
        console.error('Awesome Notifications is not available.');
    }
};
new Vue({
  el: '#app',
  data: {
    notifier: [],
    time: '',
    thaiDate: '',
    defaultRooms: [
      { roomNumber: 1, roomName: '3', queueHistory: [], currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFEB00', colorName: 'เหลือง' },
      { roomNumber: 2, roomName: '4', queueHistory: [], currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFC0CB', colorName: 'ชมพู' },
      { roomNumber: 3, roomName: '5', queueHistory: [], currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#98FB98', colorName: 'เขียว' },
      { roomNumber: 4, roomName: '6', queueHistory: [], currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FFA500', colorName: 'ส้ม' },
      { roomNumber: 5, roomName: '8 โต๊ะ 1', queueHistory: [], currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#87CEEB', colorName: 'ฟ้า' },
      { roomNumber: 6, roomName: '8 โต๊ะ 2', queueHistory: [], currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#8967B3', colorName: 'ม่วง' },
      { roomNumber: 7, roomName: '8 โต๊ะ 3', queueHistory: [], currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FF6347', colorName: 'แดง' },
      { roomNumber: 8, roomName: '10', queueHistory: [], currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#FEFEFE', colorName: 'ขาว' },
      { roomNumber: 9, roomName: '11', queueHistory: [], currentQueue: null, nextQueue: 1, calledQueues: [], isActive: true, rgbColor: '#999999', colorName: 'เทา' } // เปลี่ยนสีขาวเป็นสีฟ้าสว่าง
    ],
    rooms: [], // ใช้ rooms เป็นข้อมูลหลัก
    audioQueue: [], // คิวเสียงที่กำลังจะเล่น
    maxAudioQueue: 5, // จำนวนคิวเสียงสูงสุดที่อนุญาต
    globalQueueHistory: [], // ฟิลด์สำหรับเก็บประวัติรวมทุกห้อง
    currentPage: 1,         // หน้าปัจจุบันของ Pagination
    itemsPerPage: 20,       // จำนวนรายการต่อหน้า
  },
  mounted() {
    this.updateTime(); // โหลดเวลาเริ่มต้น
    this.getCurrentThaiDate();
    setInterval(this.updateTime, 1000); // อัปเดตเวลาใหม่ทุกวินาที
    this.notifier = new AWN(
      {
        position: 'top-right'
      }
    );
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
        this.rooms = storedData.rooms || this.defaultRooms;
      } else {
        this.rooms = this.defaultRooms; // ใช้ค่าเริ่มต้นหากไม่มีข้อมูลใน localStorage
      }
    },
    callNextQueue(roomNumber) {
      const room = this.rooms.find(r => r.roomNumber === roomNumber);
      const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }); // เวลาปัจจุบันในรูปแบบ HH:MM:SS
      
      if (room && room.isActive) {

        // ตรวจสอบว่า room.queueHistory มีหรือไม่ ถ้าไม่มีให้สร้างเป็น array
        if (!room.queueHistory) {
          room.queueHistory = [];
        }

        room.queueHistory.push({ queue: room.nextQueue, time: now });

        // บันทึกประวัติรวมทุกห้อง
        this.globalQueueHistory.push({
          roomNumber: room.roomNumber,
          roomName: room.roomName,
          queue: room.nextQueue,
          time: now
        });
        // เรียงลำดับประวัติรวมทั้งหมดใหม่
        this.globalQueueHistory.sort((a, b) => b.time.localeCompare(a.time));

        room.currentQueue = room.nextQueue;
        room.calledQueues.push(room.nextQueue);
        room.nextQueue++; // เพิ่มหมายเลขคิวถัดไป

        if (room.calledQueues.length > 5) {
          room.calledQueues.shift(); // จำกัดจำนวนคิวที่เก็บไว้ใน calledQueues ให้ไม่เกิน 5
        }

        this.saveQueueData();
        this.speakQueue(room.currentQueue, room.roomNumber, room.roomName, room.rgbColor, room.colorName); // เล่นเสียงเรียกคิว
      }
    },
    resetRoomQueue(roomNumber) {
      const room = this.rooms.find(r => r.roomNumber === roomNumber);
      if (room && room.isActive && confirm(`คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตคิวสำหรับห้อง ${room.roomName}?`)) {
        room.currentQueue = null;
        room.nextQueue = 1;
        room.calledQueues = [];
        room.queueHistory = []; // รีเซ็ตประวัติการเรียกคิว
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
          room.queueHistory = []; // รีเซ็ตประวัติการเรียกคิว
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
        this.speakQueue(lastQueue, room.roomNumber, room.roomName, room.rgbColor, room.colorName); // เล่นเสียงเรียกคิว
        this.saveQueueData();
      }
    },
    reCallQueue(roomNumber, queueNumber) {
      const room = this.rooms.find(r => r.roomNumber === roomNumber);
      if (room && room.isActive) {
        room.currentQueue = queueNumber;
        this.speakQueue(queueNumber, room.roomNumber, room.roomName, room.rgbColor, room.colorName); // เล่นเสียงเรียกคิว
        this.saveQueueData();
      }
    },
    saveQueueData() {
      const data = {
        rooms: this.rooms
      };
      localStorage.setItem('queueData', JSON.stringify(data));
    },
    speakQueue(queueNumber, roomNumber, roomName, rgbColor, colorName) {
      if (this.audioQueue.length < this.maxAudioQueue) {
        //const colorName = this.rooms.find(r => r.rgbColor === rgbColor).colorName || 'สีไม่รู้จัก';
        //let message = `เชิญบัตรคิว สี${colorName} หมายเลข "${queueNumber}" ที่ ${roomName}`;
        let message = `เชิญบัตรคิวสี  ${colorName}  หมายเลข "${queueNumber}" ที่ ห้องตรวจ ${roomName}  `;
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=${message}`;
        const audio = new Audio(audioUrl);

        // เพิ่มเข้าในคิวเสียง
        this.audioQueue.push({ queueNumber, roomNumber, message, audio });

        // เล่นเสียงเมื่อคิวไม่มีการเล่น
        if (this.audioQueue.length === 1) {
          this.playNextAudio();
        }
      } else {
        this.notifier.alert('คิวเสียงเต็ม', 'ไม่สามารถเพิ่มคิวเสียงใหม่ได้ในขณะนี้');
      }
    },

    playNextAudio() {
      if (this.audioQueue.length > 0) {
        const currentAudio = this.audioQueue[0];
        console.log(this.audioQueue);
        this.notifier.success(this.audioQueue[0].message)
        currentAudio.audio.play();
        currentAudio.audio.onended = () => {
          // เมื่อเสียงจบ นำออกจากคิว
          this.audioQueue.shift();
          if (this.audioQueue.length > 0) {
            this.playNextAudio(); // เล่นคิวถัดไป
          }
        };
      }
    },
    showNotification(title, message) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
      } else {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body: message });
          }
        });
      }
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
        this.rooms = JSON.parse(JSON.stringify(this.defaultRooms)); // รีเซ็ตค่าทั้งหมด
        this.saveQueueData();
        alert('ข้อมูลทั้งหมดถูกล้างเรียบร้อยแล้ว!');
      }
    },
    getCurrentThaiDate() {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const currentDate = new Date();
      this.thaiDate = currentDate.toLocaleDateString('th-TH', options);
    },

    // เปลี่ยนหน้าไปหน้าก่อนหน้า
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // เปลี่ยนหน้าไปหน้าถัดไป
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    notify() {
        AwesomeNotifications.createNotification({
            title: 'Hello!',
            message: 'This is a notification from Awesome Notifications.',
            type: 'info'
        });
    }
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.loadQueueData); // ลบ event listener เมื่อ component ถูกทำลาย
  },
  computed: {
    audioQueueCount() {
      return this.audioQueue.length;
    },
    // จำนวนหน้าทั้งหมด
    totalPages() {
      return Math.ceil(this.globalQueueHistory.length / this.itemsPerPage);
    },
    // ข้อมูลประวัติการเรียกคิวที่แสดงผลตามหน้า
    paginatedGlobalHistory() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.globalQueueHistory.slice(start, end);
    }
  }

});
