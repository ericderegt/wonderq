class Consumer {
  /**
   * Consumer class creates an instance of a consumer, which polls a queue for messages
   * @param {WonderQ} queue - queue that Consumer receives messages from
   */
  constructor(queue) {
    if (!queue) {
      return new Error("Consumer must have a queue.");
    } else {
      this.queue = queue;
    }
  }
}

module.exports = Consumer;
