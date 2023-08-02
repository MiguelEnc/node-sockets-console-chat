class Publisher {
  constructor(username) {
    this.username = username;
    this.subscribers = new Set();
  }

  addSubscriber(subscriber) {
    this.subscribers.add(subscriber);
  }

  removeSubscriber(subscriber) {
    this.subscribers.delete(subscriber);
  }

  notifySubscribers(message) {
    this.subscribers.forEach((peer) => peer.write(this.logMessage(message)));
  }

  logMessage(message) {
    return `[${this.username}]: ${message}`;
  }
}

module.exports = Publisher;