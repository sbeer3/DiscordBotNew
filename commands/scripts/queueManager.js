class QueueManager {
  constructor() {
      this.queue = [];
  }

  addSong(song) {
      this.queue.push(song);
  }

  getNextSong() {
      return this.queue.shift();
  }

  isEmpty() {
      return this.queue.length === 0;
  }

  getQueue() {
    return this.queue;
  }

  removeSong(position) {
    return this.queue.splice(position, 1)[0];
  }
}

const queueManager = new QueueManager();

module.exports = queueManager;