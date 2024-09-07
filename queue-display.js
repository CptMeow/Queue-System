new Vue({
    el: '#app',
    data: {
        rooms: [
            { roomNumber: 1, calledQueues: [] },
            { roomNumber: 2, calledQueues: [] },
            { roomNumber: 3, calledQueues: [] },
            { roomNumber: 4, calledQueues: [] },
            { roomNumber: 5, calledQueues: [] },
            { roomNumber: 6, calledQueues: [] },
            { roomNumber: 7, calledQueues: [] }
        ]
    },
    mounted() {
        this.updateQueueData(); // โหลดข้อมูลครั้งแรกเมื่อเปิดหน้าเว็บ
        setInterval(this.updateQueueData, 5000); // อัปเดตข้อมูลทุก 5 วินาที
    },
    methods: {
        updateQueueData() {
            const storedData = JSON.parse(localStorage.getItem('queueData'));
            if (storedData) {
                this.rooms = storedData.rooms;
            }
        }
    }
});
