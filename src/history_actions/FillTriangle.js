import HistoryAction from './HistoryAction';

class FillTriangle extends HistoryAction {
  constructor(triangle, previousColor = null, nextColor = null) {
    super();
    this.triangle = triangle;
    this.previousColor = previousColor;
    this.nextColor = nextColor;
  }
  undo() {
    super.undo();
    if (this.previousColor) {
      this.triangle.fill(this.previousColor);
    } else {
      this.triangle.erase();
    }
  }
  redo() {
    super.redo();
    if (this.nextColor) {
      this.triangle.fill(this.nextColor);
    } else {
      this.triangle.erase();
    }
  }
}

export default FillTriangle;
