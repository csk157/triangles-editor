class History {
  constructor() {
    this.actions = [];
    this.currentIndex = -1;
  }
  addAction(action) {
    this.actions = this.actions.slice(0, this.currentIndex + 1);
    this.actions.push(action);
    this.currentIndex++;
  }
  undo() {
    if (this.actions.length === 0 || this.currentIndex === -1) {
      return null;
    }

    const res = this.actions[this.currentIndex];
    this.currentIndex--;

    return res;
  }
  redo() {
    if (
      this.actions.length === 0 ||
      this.currentIndex + 1 >= this.actions.length
    ) {
      return null;
    }

    this.currentIndex++;
    return this.actions[this.currentIndex];
  }
}

export default History;
