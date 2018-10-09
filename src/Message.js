class Message {
  /**
   * Message class will store contents of a message. Message ID initially null until it is added to a queue.
   * @param {String} body - message body
   * @param {Date} timestamp - time message was created
   */
  constructor(body, timestamp = new Date()) {
    this.body = body;
    this.id = null;
    this.timestamp = timestamp;

    if (!body) {
      return new Error("Message must have a body.");
    }
  }
}

module.exports = Message;
