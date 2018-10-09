var assert = require('assert');

describe('WonderQ', function() {
  it('Create a queue', function() {
    const queue = WonderQ('Queue');
    // assert.equal([1,2,3].indexOf(2), 1);
    (queue instanceof WonderQ).should.be.true;
  });

  it('Write message should return ID', function() {
    const queue = WonderQ('Queue');
    const message = {'timestamp': new Date(), 'body': 'this is the body'};

    const msg = queue.writeMessage(message);
    expect(msg).to.be.Number();
  });
});
