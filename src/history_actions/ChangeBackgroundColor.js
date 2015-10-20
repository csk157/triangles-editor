import HistoryAction from './HistoryAction';

class ChangeBackgroundColor extends HistoryAction {
  constructor(background, previousColor = null, nextColor = null) {
    super();
    this.background = background;
    this.previousColor = previousColor;
    this.nextColor = nextColor;
  }
  undo() {
    super.undo();
    if (this.previousColor) {
      this.background.fillColor = this.previousColor;
      this.background.visible = true;
    } else {
      this.background.visible = false;
    }
  }
  redo() {
    super.redo();
    if (this.nextColor) {
      this.background.fillColor = this.nextColor;
      this.background.visible = true;
    } else {
      this.background.visible = false;
    }
  }
}

export default ChangeBackgroundColor;
