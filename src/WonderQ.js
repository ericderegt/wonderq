class WonderQ {
  /**
   *
   * @param {String} name - queue name
   */
  constructor(name) {
    this.name = name;
    this.store = [];
  }


  /**
   * @param {Message} message - message to add to queue
   * @returns {number} id
   */
  writeMessage(message) {
    // TODO: implement id logic
    this.store.push(message);
    // return 1;
  }

  /**
   * @param {number} numMessages - number of messages to return. defaults to all messages.
   * @returns {Array.<number>}
   */
  pollMessage(numMessages) {
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
