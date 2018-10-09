var assert = require('chai').assert;
var expect = require('chai').expect;

const WonderQ = require('../src/WonderQ');
const Message = require('../src/Message');
const Producer = require('../src/Producer');
const Consumer = require('../src/Consumer');

describe('WonderQ', function() {
  it('Create a queue', function() {
    const queue = new WonderQ('Queue');
    assert.equal((queue instanceof WonderQ), true);
  });

  it('Write message should return ID', function() {
    const queue = new WonderQ('Queue');
    const message = {'timestamp': new Date(), 'body': 'this is the body'};

    const msg = queue.writeMessage(message);
    expect(msg).to.be.a('number');
  });

  it('Should be able to add and remove a single message to queue', function() {
    const queue = new WonderQ('Queue');
    const message = {'timestamp': new Date(), 'body': 'this is the body'};

    queue.writeMessage(message);

    const pollMessage = queue.pollQueue(1);
    assert.lengthOf(pollMessage, 1);
    assert.equal(pollMessage[0].body, 'this is the body');
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
});

describe('Consumer', function() {
  it('Create a Consumer', function() {
    const queue = new WonderQ('Queue');
    const consumer = new Consumer(queue);
    assert.equal((consumer instanceof Consumer), true);
  });
});
