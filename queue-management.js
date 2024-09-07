document.addEventListener('DOMContentLoaded', function() {
    const numberOfRooms = 7;

    function addRoomOptions() {
        const roomSelect = document.getElementById('roomSelect');
        if (roomSelect) {
            roomSelect.innerHTML = '';

            for (let i = 1; i <= numberOfRooms; i++) {
                let option = document.createElement('option');
                option.value = i;
                option.textContent = `ห้อง ${i}`;
                roomSelect.appendChild(option);
            }
        }
    }

    function initializeQueue() {
        for (let i = 1; i <= numberOfRooms; i++) {
            if (!localStorage.getItem(`calledQueue-${i}`)) {
                localStorage.setItem(`calledQueue-${i}`, 0);
            }
        }
        if (!localStorage.getItem('currentQueue')) {
            localStorage.setItem('currentQueue', JSON.stringify({ queue: 0, room: 1 }));
        }
    }

    function loadCurrentQueue() {
        let savedQueue = localStorage.getItem('currentQueue');
        if (savedQueue) {
            return JSON.parse(savedQueue);
        }
        return null;
    }

    function updateCalledQueue(roomNumber) {
        let calledQueue = parseInt(localStorage.getItem(`calledQueue-${roomNumber}`)) || 0;
        calledQueue++;
        localStorage.setItem(`calledQueue-${roomNumber}`, calledQueue);
    }

    function saveCurrentQueue(queueNumber, roomNumber) {
        const queueData = { queue: queueNumber, room: parseInt(roomNumber) };
        localStorage.setItem('currentQueue', JSON.stringify(queueData));
    }

    function callNextQueue() {
        const roomSelect = document.getElementById('roomSelect');
        const selectedRoom = roomSelect ? roomSelect.value : null;

        if (!selectedRoom) {
            return;
        }

        let currentQueue = loadCurrentQueue();
        if (currentQueue && currentQueue.room == selectedRoom) {
            let nextQueueNumber = currentQueue.queue + 1;
            updateCalledQueue(selectedRoom);
            saveCurrentQueue(nextQueueNumber, selectedRoom);

            // เรียกใช้ฟังก์ชันเสียง
            playQueueAudio(nextQueueNumber, selectedRoom);

            // อัพเดตหน้าจอแสดงคิว
            updateQueueDisplays();
        }
    }

    function clearAllQueues() {
        for (let i = 1; i <= numberOfRooms; i++) {
            localStorage.removeItem(`calledQueue-${i}`);
        }
        localStorage.removeItem('currentQueue');

        // อัพเดตหน้าจอแสดงคิวหลังจากล้างคิว
        updateQueueDisplays();
    }

    function playQueueAudio(queueNumber
