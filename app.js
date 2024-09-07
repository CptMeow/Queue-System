new Vue({
    el: '#app',
    data: {
        numberOfRooms: 7,
        currentQueue: JSON.parse(localStorage.getItem('currentQueue')) || {},
        roomQueues: Array.from({ length: 7 }, (_, i) => i + 1),
        queues: {}
    },
    computed: {
        getCurrentQueue() {
            return this.currentQueue.room ? `คิว ${this.currentQueue.queue}` : 'ไม่มีคิวปัจจุบัน';
        },
        getRecentQueues() {
            const recentQueues = {};
            for (let i = 1; i <= this.numberOfRooms; i++) {
                const queuesString = localStorage.getItem(`calledQueue-${i}`);
                let queues = [];
                if (queuesString) {
                    try {
                        queues = JSON.parse(queuesString);
                        if (!Array.isArray(queues)) {
                            queues = [];
                        }
                    } catch (e) {
                        console.error('Error parsing queues:', e);
                        queues = [];
                    }
                }
                recentQueues[i] = queues.slice(-5);
            }
            return recentQueues;
        }
    },
    methods: {
        callNextQueue(roomNumber) {
            let currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
            const queuesKey = `calledQueue-${roomNumber}`;
            let calledQueues = JSON.parse(localStorage.getItem(queuesKey)) || [];

            if (currentQueue.room === roomNumber.toString()) {
                calledQueues.push(currentQueue.queue);
            }

            const newQueueNumber = (calledQueues.length > 0 ? Math.max(...calledQueues) : 0) + 1;
            currentQueue = { room: roomNumber.toString(), queue: newQueueNumber };

            localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
            localStorage.setItem(queuesKey, JSON.stringify(calledQueues));

            this.currentQueue = currentQueue;
            this.speakQueue(currentQueue);
        },
        speakQueue(queue) {
            const queueText = `เชิญหมายเลข ${queue.queue} ที่ห้อง ${queue.room}`;
            const utterance = new SpeechSynthesisUtterance(queueText);
            utterance.lang = 'th-TH'; // ภาษาไทย
            utterance.rate = 0.8; // ความเร็วของเสียงพูด

            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }

            speechSynthesis.speak(utterance);
        },
        getCurrentQueueForRoom(roomNumber) {
            const currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
            if (currentQueue.room === roomNumber.toString()) {
                return `คิว ${currentQueue.queue}`;
            }
            return 'ไม่มีคิวปัจจุบัน';
        }
    },
    mounted() {
        // ลบฟังก์ชัน updateQueueTable ออก ถ้าไม่ใช้
    }
});
