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

    this.messages = [];
  }

  /**
   * @returns {Array.<Message>} - all messages that are not currently being processed by other Consumers
   */
  getMessages() {
    const messages = this.queue.pollQueue();

    for (let msg of messages) {
        this.messages.push(msg);
    }

    return this.messages;
  }

  /**
   * processMessage takes the first message on the Consumer's queue, processes it, and sends an acknowledgement to WonderQ
   */
  processMessage() {
    let message = this.messages.splice(0,1)[0];

    // TODO - Do further processing here

    this.queue.deleteMessage(message);
  }
}

module.exports = Consumer;
