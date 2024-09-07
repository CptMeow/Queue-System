new Vue({
    el: '#app',
    data: {
        roomQueues: [1, 2, 3, 4, 5, 6, 7], // มีห้อง 7 ห้อง
        currentQueues: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
        }
    },
    methods: {
        getCurrentQueueForRoom(room) {
            return this.currentQueues[room];
        },
        callNextQueue(room) {
            this.currentQueues[room]++;
        },
        confirmResetQueues() {
            if (confirm("คุณแน่ใจหรือไม่ว่าต้องการเริ่มต้นคิวใหม่? การกระทำนี้ไม่สามารถยกเลิกได้")) {
                this.resetQueues();
            }
        },
        resetQueues() {
            for (let room in this.currentQueues) {
                this.currentQueues[room] = 1; // เริ่มคิวใหม่ที่ 1 สำหรับแต่ละห้อง
            }
            alert("คิวถูกรีเซ็ตเรียบร้อยแล้ว!");
        }
    }
});
