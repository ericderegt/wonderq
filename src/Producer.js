class Producer {
  /**
   * Producer class creates an instance of a producer, which sends messages to a queue
   * @param {WonderQ} queue - queue that Producer sends messages to
   */
  constructor(queue) {
    if (!queue) {
      return new Error("Producer must have a queue.");
    } else {
      this.queue = queue;
    }
  }
}

module.exports = Producer;
