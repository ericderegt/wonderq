var assert = require('chai').assert;
var expect = require('chai').expect;

const WonderQ = require('../src/WonderQ');
const Message = require('../src/Message');
const Producer = require('../src/Producer');
const Consumer = require('../src/Consumer');
const Profiler = require('../src/Profiler');


describe('WonderQ', function() {
  it('Create a queue', function() {
    const queue = new WonderQ('Queue');
    assert.equal((queue instanceof WonderQ), true);
  });

  it('Write message should return ID', function() {
    const queue = new WonderQ('Queue');
    const message = {'timestamp': new Date(), 'body': 'this is the body'};

    const msg = queue.writeMessage(message);
    expect(msg).to.be.a('string');
  });

  it('Should be able to add and remove a single message to queue', function() {
    const queue = new WonderQ('Queue');
    const message = {'timestamp': new Date(), 'body': 'this is the body'};

    queue.writeMessage(message);

    const pollMessage = queue.pollQueue(1);
    assert.lengthOf(pollMessage, 1);
    assert.equal(pollMessage[0].body, 'this is the body');
  });

  it('Messages should be available again after timeout', function() {
    const queue = new WonderQ('Queue');
    const producer = new Producer(queue);
    const consumer1 = new Consumer(queue);
    const consumer2 = new Consumer(queue);

    const message1 = new Message('this is a message');
    const message2 = new Message('this is another message');
    producer.sendMessage(message1);
    producer.sendMessage(message2);

    const messages = consumer1.getMessages();
    expect(messages).to.have.lengthOf(2);

    // used to simulate time having passed
    for (let i = 0; i < queue.processing.length; i++) {
      queue.processing[i].ttl = new Date(Date.now() - 20000); // default timeout is 500
    }

    const message3 = new Message('this is a third message');
    producer.sendMessage(message3);

    const repolledMessages = consumer2.getMessages();
    console.log(repolledMessages);
    expect(repolledMessages).to.have.lengthOf(3);

  });
});

describe('Message', function() {
  it('Create a message', function() {
    const message = new Message('this is a message');
    assert.equal((message instanceof Message), true);
    assert.property(message, 'timestamp');
    assert.equal(message.body, 'this is a message');
    assert.property(message, 'timestamp');
    assert.property(message, 'id');
    expect(message.timestamp).to.be.a('Date');
  });

  it('Message without body should fail', function() {
    const message = new Message();
    expect(message).to.be.an('error');
  });
});

describe('Producer', function() {
  it('Create a Producer', function() {
    const queue = new WonderQ('Queue');
    const producer = new Producer(queue);
    assert.equal((producer instanceof Producer), true);
  });

  it('Producer without queue should fail', function() {
    const producer = new Producer();
    expect(producer).to.be.an('error');
  });

  it('Send Message to WonderQ', function() {
    const queue = new WonderQ('Queue');
    const producer = new Producer(queue);
    const message = new Message('this is a message');

    // Send message to WonderQ
    const confirm = producer.sendMessage(message);

    expect(confirm).to.be.a('string');
  });
});

describe('Consumer', function() {
  it('Create a Consumer', function() {
    const queue = new WonderQ('Queue');
    const consumer = new Consumer(queue);
    assert.equal((consumer instanceof Consumer), true);
  });

  it('Consumer without queue should fail', function() {
    const consumer = new Consumer();
    expect(consumer).to.be.an('error');
  });

  it('Poll messages', function() {
    const queue = new WonderQ('Queue');
    const consumer = new Consumer(queue);

    const message1 = new Message('this is a message');
    const message2 = new Message('this is another message');
    const message3 = new Message('this is yet another message');

    // Not using Producer's sendMessage here to isolate these tests to Consumer class
    queue.writeMessage(message1);
    queue.writeMessage(message2);
    queue.writeMessage(message3);

    const messages = consumer.getMessages();
    expect(messages).to.have.lengthOf(3);

    // check that message was given id
    expect(messages[0].id).to.be.a('string');
  });

  it('Process received message', function() {
    const queue = new WonderQ('Queue');
    const consumer = new Consumer(queue);

    const message1 = new Message('this is a message');
    const message2 = new Message('this is another message');

    queue.writeMessage(message1);
    queue.writeMessage(message2);

    const messages = consumer.getMessages();
    const msg = messages[0];

    consumer.processMessage();

    // check that message was deleted
    expect(queue.findMessage(msg)).to.be.false;
  })

  it('Poll and process should delete message', function() {
    const queue = new WonderQ('Queue');
    const consumer = new Consumer(queue);

    const message1 = new Message('this is a message');
    const message2 = new Message('this is another message');
    queue.writeMessage(message1);
    queue.writeMessage(message2);

    const messages = consumer.getMessages();
    const msg = messages[0];
    consumer.processMessage();

    const message3 = new Message('this is a third message');
    queue.writeMessage(message3);

    const repolledMessages = consumer.getMessages();
    expect(repolledMessages).to.have.lengthOf(2);

  });
});

describe('Profiler', function() {
  it('Create a Profiler', function() {
    const queue = new WonderQ('Queue');
    const profiler = new Profiler(queue);
    assert.equal((profiler instanceof Profiler), true);
  });

  it('Profiler without queue should fail', function() {
    const profiler = new Profiler();
    expect(profiler).to.be.an('error');
  });

  it('Profiler should return correct types', function() {
    const queue = new WonderQ('Queue');
    const profiler = new Profiler(queue);

    const message1 = new Message('this is a message');
    const message2 = new Message('this is another message');
    queue.writeMessage(message1);
    queue.writeMessage(message2);

    queue.pollQueue();

    const message3 = new Message('this is a third message');
    queue.writeMessage(message3);

    const stats = profiler.getStats();
    expect(stats[0]).to.be.a('string');
    expect(stats[1]).to.be.a('number');
    expect(stats[2]).to.be.a('number');
  });
});
