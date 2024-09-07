new Vue({
    el: '#app',
    data: {
        numberOfRooms: 7,
        currentQueue: JSON.parse(localStorage.getItem('currentQueue')) || {},
        roomQueues: Array.from({ length: 7 }, (_, i) => i + 1),
    },
    computed: {
        getCurrentQueueForRoom() {
            return roomNumber => {
                const currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
                if (currentQueue.room === roomNumber.toString()) {
                    return `คิว ${currentQueue.queue}`;
                }
                return 'ไม่มีคิวปัจจุบัน';
            };
        }
    },
    methods: {
        callNextQueue(roomNumber) {
            let currentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {};
            const queuesKey = `calledQueue-${roomNumber}`;
            let calledQueues = JSON.parse(localStorage.getItem(queuesKey)) || [];

            const newQueueNumber = (calledQueues.length > 0 ? Math.max(...calledQueues) : 0) + 1;

            currentQueue = { room: roomNumber.toString(), queue: newQueueNumber };

            localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
            calledQueues.push(newQueueNumber);
            localStorage.setItem(queuesKey, JSON.stringify(calledQueues));

            this.currentQueue = currentQueue;
            this.speakQueue(currentQueue);
        },
        speakQueue(queue) {
            const queueText = `เชิญหมายเลข ${queue.queue} ที่ห้อง ${queue.room}`;
            const utterance = new SpeechSynthesisUtterance(queueText);
            utterance.lang = 'th-TH'; // ภาษาไทย
            utterance.rate = 0.5; // ความเร็วของเสียงพูด

            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }

            speechSynthesis.speak(utterance);
        }
    }
});
