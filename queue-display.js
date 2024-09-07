new Vue({
    el: '#app',
    data: {
        rooms: [
            { roomNumber: 1, currentQueue: 1, calledQueues: [] },
            { roomNumber: 2, currentQueue: 1, calledQueues: [] },
            { roomNumber: 3, currentQueue: 1, calledQueues: [] },
            { roomNumber: 4, currentQueue: 1, calledQueues: [] },
            { roomNumber: 5, currentQueue: 1, calledQueues: [] },
            { roomNumber: 6, currentQueue: 1, calledQueues: [] },
            { roomNumber: 7, currentQueue: 1, calledQueues: [] }
        ]
    },
    mounted() {
        this.updateQueueData(); // โหลดข้อมูลครั้งแรกเมื่อเปิดหน้าเว็บ
        setInterval(this.updateQueueData, 5000); // อัปเดตข้อมูลทุก 5 วินาที
    },
    methods: {
        updateQueueData() {
            const storedRooms = JSON.parse(localStorage.getItem('rooms'));
            if (storedRooms) {
                this.rooms = storedRooms;
            }
        }
    }
});
