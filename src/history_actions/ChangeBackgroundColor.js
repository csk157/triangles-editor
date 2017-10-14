import HistoryAction from './HistoryAction';

class ChangeBackgroundColor extends HistoryAction {
  constructor(editor, previousColor = null, nextColor = null) {
    super();
    this.editor = editor;
    this.previousColor = previousColor;
    this.nextColor = nextColor;
  }
  undo() {
    super.undo();
    this.editor.background = this.previousColor;
  }
  redo() {
    super.redo();
    this.editor.background = this.nextColor;
  }
}

export default ChangeBackgroundColor;
