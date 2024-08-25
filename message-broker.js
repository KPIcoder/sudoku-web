class MessageBroker {
  events;
  constructor() {
    this.events = new Map();
  }

  subscribe(event, listener) {
    if (this.events.has(event)) {
      const listeners = this.events.get(event);
      listeners.add(listener);
      return;
    }
    const listeners = new Set();
    listeners.add(listener);
    this.events.set(event, listeners);
  }

  publish(event, ...args) {
    const listeners = this.events.get(event);
    listeners.forEach((listener) => listener(...args));
  }
}

export const messageBroker = new MessageBroker();
