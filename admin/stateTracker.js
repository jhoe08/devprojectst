// utils/stateTracker.js

class StateTracker {
  constructor(requesterId) {
    this.data = {
      requester: requesterId,
      current: requesterId,
      previous: null,
      history: [requesterId]
    };
  }

  transferTo(newId) {
    if (newId === this.data.current) return;

    this.data.previous = this.data.current;
    this.data.current = newId;

    const last = this.data.history[this.data.history.length - 1];
    if (last !== newId) {
      this.data.history.push(newId);
    }
  }

  isBackToRequester() {
    return this.data.current === this.data.requester;
  }

  getHistory() {
    return this.data.history;
  }

  getData() {
    return this.data;
  }
}

module.exports = StateTracker;
