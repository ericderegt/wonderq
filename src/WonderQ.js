class WonderQ {
  /**
   * WonderQ is a broker that allows multiple producers to write to it, and multiple consumers to read from it.
   * @param {String} name - queue name
   */
  constructor(name) {
    this.name = name;
    this.store = []; // database abstraction
  }


  /**
   * writeMessage adds a message to the queue and returns an id as confirmation
   * @param {Message} message - message to add to queue
   * @returns {number} id - id number of added message
   */
  writeMessage(message) {
    const msgUUID = this.generateUUID();
    message.id = msgUUID;

    this.store.push(message);

    return message.id;
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

  /**
   * generateUUID generates a UUID to be used as a Message's ID.
   * This is from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   * and is used in lieu of adding a crypto module, which I would have done for a production application.
   */
  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
}

module.exports = WonderQ;
