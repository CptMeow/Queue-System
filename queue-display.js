new Vue({
  el: '#app',
  data: {
    currentQueues: [], // คิวปัจจุบันของแต่ละห้อง
    calledQueues: [], // คิวที่ถูกเรียกไปแล้ว
    time: ''  // เวลา
  },
  mounted() {
    this.updateTime(); // ตั้งเวลาเริ่มต้น
    setInterval(() => this.updateTime(), 1000); // อัปเดตเวลาใหม่ทุกวินาที
    this.loadQueueData(); // โหลดข้อมูลคิว
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
      const storedQueueData = localStorage.getItem('queueData');
      if (storedQueueData) {
        const queueData = JSON.parse(storedQueueData);
        this.currentQueues = queueData.currentQueues || [];
        this.calledQueues = queueData.calledQueues || [];
        this.updateQueueTable();
      } else {
        console.error('ไม่พบข้อมูลคิวใน localStorage');
      }
    },
    updateQueueTable() {
      // สร้างตารางคิวปัจจุบัน
      const queueTable = document.getElementById('queueTable');
      if (queueTable) {
        queueTable.innerHTML = '<tr><th>ห้อง</th><th>หมายเลขคิว</th></tr>'; // ตั้งหัวตาราง

        this.currentQueues.forEach(queue => {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${queue.room}</td><td>${queue.queueNumber}</td>`;
          queueTable.appendChild(row);
        });
      } else {
        console.error('ไม่พบตารางคิวปัจจุบัน');
      }

      // สร้างตารางคิวที่เรียกไปแล้ว
      const calledQueueTable = document.getElementById('calledQueueTable');
      if (calledQueueTable) {
        calledQueueTable.innerHTML = '<tr><th>ห้อง</th><th>หมายเลขคิว</th></tr>'; // ตั้งหัวตาราง

        this.calledQueues.forEach(queue => {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${queue.room}</td><td>${queue.queueNumber}</td>`;
          calledQueueTable.appendChild(row);
        });
      } else {
        console.error('ไม่พบตารางคิวที่เรียกไปแล้ว');
      }
    }
  }
});
