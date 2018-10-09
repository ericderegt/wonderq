var assert = require('chai').assert;
var expect = require('chai').expect;

const WonderQ = require('../src/WonderQ');

describe('WonderQ', function() {
  it('Create a queue', function() {
    const queue = new WonderQ('Queue');
    // assert.equal([1,2,3].indexOf(2), 1);
    assert.equal((queue instanceof WonderQ), true);
    // (queue instanceof WonderQ).should.be.true;
  });

  it('Write message should return ID', function() {
    const queue = new WonderQ('Queue');
    const message = {'timestamp': new Date(), 'body': 'this is the body'};

    const msg = queue.writeMessage(message);
    expect(msg).to.be.a('number');
  });

  it('Should add and remove message to queue', function() {
    const queue = new WonderQ('Queue');
    const message = {'timestamp': new Date(), 'body': 'this is the body'};

    queue.writeMessage(message);

    const pollMessage = queue.pollQueue(1);
    assert.lengthOf(pollMessage, 1);
    assert.equal(pollMessage[0].body, 'this is the body');
  });
});
