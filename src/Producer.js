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

  /**
   * sendMessage sends a message to the queue and receives an ID confirmation
   * @param {Message} message - message to be sent
   * @return {Number} messageID - ID returned as confirmation from queue
   */
  sendMessage(message) {
    if (!message) {
      return new Error("Message must not be empty.");
    }

    const messageID = this.queue.writeMessage(message);

    if (!messageID instanceof Number) {
      return new Error("Message unsuccessful.");
    } else {
      return messageID;
    }
  }
}

module.exports = Producer;
