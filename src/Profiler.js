class Profiler {
  /**
   * Profiler class is a tool to allow developers to see key stats about a WonderQ
   * @param {WonderQ} queue - queue that Profiler gets statistics on
   */
  constructor(queue) {
    if (!queue) {
      return new Error("Profiler must have a queue.");
    } else {
      this.queue = queue;
    }
  }

  /**
   * getStats gets various statistics about a WonderQ
   * @returns {Array}
   */
  getStats() {
    let name = this.queue.name;
    let storeSize = this.queue.store.length;
    let processingSize = this.queue.store.length;

    let message = `WonderQ - ${name}\n Store size - ${storeSize}\n Processing queue size - ${processingSize}`;
    console.log(message);

    return [name, storeSize, processingSize];
  }
}

module.exports = Profiler;
