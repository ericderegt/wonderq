class WonderQ {
  /**
   *
   * @param {String} name - queue name
   */
  constructor(name) {
    this.name = name;
    this.store = []; // database abstraction
  }


  /**
   * @param {Message} message - message to add to queue
   * @returns {number} id - id number of added message
   */
  writeMessage(message) {
    // TODO: implement id logic
    this.store.push(message);
    // return 1;
  }

  /**
   * pollQueue returns messages which are not currently being processed by any other consumer.
   * Messages will be made unavailable to other consumers until timeout is reached.
   * @param {number} numMessages - number of messages to poll in current request.
   * @returns {Array.<Message>} - returns up to numMessages or else all messages
   */
  pollQueue(numMessages) {
    if (!numMessages || numMessages >= this.store.length) {
      const messages = this.store;
      this.store = [];
      return messages;
    } else {
      const messages = this.store.splice(0, numMessages);
      return messages;
    }
  }
}

module.exports = WonderQ;
