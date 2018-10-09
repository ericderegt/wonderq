class WonderQ {
  /**
   * WonderQ is a broker that allows multiple producers to write to it, and multiple consumers to read from it.
   * @param {String} name - queue name
   */
  constructor(name, timeout = 500) {
    this.name = name;
    this.store = []; // database abstraction
    this.processing = [];
    this.timeout = timeout; // milliseconds until timeout
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
    // Check if any old messages and add back to store if so
    this.checkAvailableMessages();

    if (!numMessages || numMessages >= this.store.length) {
      const messages = this.store;
      this.store = [];

      for (let msg of messages) {
        msg.ttl = new Date(Date.now() + this.timeout);
        this.processing.push(msg);
      }

      return messages;
    } else {
      const messages = this.store.splice(0, numMessages);

      for (let msg of messages) {
        msg.ttl = new Date(Date.now() + this.timeout);
        this.processing.push(msg);
      }

      return messages;
    }
  }

  /**
   * deleteMessage receives a message from a Consumer that has processed it.
   * This message is then deleted from the data store.
   * @param {Message} message - message to be deleted
   */
  deleteMessage(message) {
    let messageID = message.id;
    let index = this.processing.findIndex(msg => msg.id === messageID);

    if (index != -1) {
      this.processing.splice(index, 1);
    }
  }

  /**
   * findMessage checks both the store and processing queue for a given message
   * @param {Message} message - message to search for
   * @returns {Boolean} found - true if found in either store or processing queue, false otherwise
   */
  findMessage(message) {
    let messageID = message.id;

    let indexProcessing = this.processing.findIndex(msg => msg.id === messageID);
    let indexStore = this.store.findIndex(msg => msg.id === messageID);

    return (indexProcessing != -1) || (indexStore != -1);
  }

  /**
   * checkAvailableMessages checks whether there are messages that haven't been processed in time.
   * These messages are then removed from the processing queue and added to the store where they may be consumed again.
   * No inputs or return values. This function is called every second and mutates state.
   */
  checkAvailableMessages() {
    let curDate = new Date();

    for (let i = 0; i < this.processing.length; i++) {
      let ttl = this.processing[i].ttl;
      if (curDate > ttl) {
        let message = this.processing.splice(i, 1);
        i--; // we are removing an element from the array and so don't want to increment
        this.store.push(message);
      }
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
