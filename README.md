# WonderQ

WonderQ is a broker that allows multiple producers to write to it, and multiple consumers to read from it.

# Instructions
1. `npm install`
2. `npm test` to run tests
3. The module contains 5 classes that represent the WonderQ. They are detailed below

# Classes
* **WonderQ** - contains all messages that are in the store or currently being processed.
  * Create WonderQ - `new Queue(queueName)`
* **Producer** - can send messages to the queue.
  * Create Producer - `new Producer(queue)`
  * Send message to WonderQ - `producer.sendMessage(message)`
* **Consumer** - can receive messages from the queue. Consumer can also process messages and send acknowledgement to the queue.
  * Create Consumer - `new Consumer(queue)`
  * Poll messages from WonderQ - `consumer.getMessages()`
  * Process message - `consumer.processMessage()`
* **Message** - class to represent a message.
  * Create Message - `new Message(messageBody)`
* **Profiler** - developer tool to view key statistics of a queue.
  * Create Profiler - `new Profiler(queue)`
  * Get summary statistics - `profiler.getStats()`

# Scaling
- Discuss how would you go about scaling this system to meet high-volume requests? What infrastructure / stack would you use and why?
- In a real system, we would need to be able to deal with large amounts of traffic to the system and appropriately handle concurrency and the size of the queue. I am making an assumption that maintaining total order on the messages is not a requirement (as in SQS).
- I would use a combination of a RDBS (say MySQL) and a caching layer (Redis). If we just used a cache, it would get very expensive as the number of messages became large. On the other hand, if we just used a RDBS then we might not have the desired speed to poll messages.
- We could pick a manageable number of messages to store in Redis (1,000 for example) that would service polling requests and the remainder could be stored in MySQL.
