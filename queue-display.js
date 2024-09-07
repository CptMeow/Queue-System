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
        this.updateQueueData(); // โหลดข้อมูลครั้งแรก
        window.addEventListener('storage', this.updateQueueData); // ฟังการเปลี่ยนแปลงของ LocalStorage
    },
    methods: {
        updateQueueData() {
            const storedData = JSON.parse(localStorage.getItem('queueData'));
            if (storedData) {
                this.rooms = storedData.rooms;
            }
        }
    },
    beforeDestroy() {
        window.removeEventListener('storage', this.updateQueueData); // ลบ event listener เมื่อ component ถูกทำลาย
    }
});
