import _ from 'underscore';
import Paper from 'paper';
import Grid from './Grid';
import Triangle from './Triangle';
import History from './History';
import { FillTriangle, ChangeBackgroundColor } from './history_actions';

class Editor {
  constructor(elem, {unitSize}) {
    this.width = Math.floor(elem.width / unitSize);
    this.height = Math.floor(elem.height / unitSize);
    this.unitSize = unitSize;
    this.gridLines = null;
    this.background = null;

    this.grid = new Grid({
      width: this.width,
      height: this.height,
    }, unitSize);
    this.history = new History();
    this.canvas = Paper.setup(elem);
    this.element = elem;
    this.createBackground();
    this.drawGridLines();
    this.createTriangles();

    Paper.view.draw();
  }

  drawGridLines() {
    const lines = this.grid.getLines();
    const gridLines = _.map(lines, (l) => {
      return new Paper.Path.Line({
        from: l.from,
        to: l.to,
        strokeColor: '#666',
      });
    });

    this.gridLines = new Paper.Group(gridLines);
  }

  createBackground() {
    this.background = new Paper.Path.Rectangle({
      point: new Paper.Point(0, 0),
      size: new Paper.Size(this.width * this.unitSize, this.height * this.width * this.unitSize),
      fillColor: '#FF0000',
      visible: false,
    });
  }

  createTrianglesFromRect(rect) {
    const center = {x: rect.x + (rect.width / 2), y: rect.y + (rect.height / 2)};
    const topLeft = {x: rect.x, y: rect.y};
    const bottomLeft = {x: rect.x, y: rect.y + rect.height};
    const topRight = {x: rect.x + rect.width, y: rect.y};
    const bottomRight = {x: rect.x + rect.width, y: rect.y + rect.height};

    const leftTriangle = new Triangle(topLeft, center, bottomLeft);
    const topTriangle = new Triangle(topLeft, center, topRight);
    const rightTriangle = new Triangle(topRight, center, bottomRight);
    const bottomTriangle = new Triangle(bottomLeft, center, bottomRight);

    return {
      left: leftTriangle,
      right: rightTriangle,
      top: topTriangle,
      bottom: bottomTriangle,
    };
  }

  createTriangles() {
    this.grid.iterateCells((pos) => {
      const rect = this.grid.getCellRealRectangle(pos);
      const triangles = this.createTrianglesFromRect(rect);
      this.grid.setGridValue(pos, triangles);
    });
  }

  getTriangleAt(pos) {
    const gridPosition = this.grid.getGridPosition(pos);
    const gridValue = this.grid.getGridValue(gridPosition);
    const triangles = _.values(gridValue);

    return _.find(triangles, (triangle) => triangle.isPointInside(pos));
  }

  fillTriangleAt(pos, color) {
    const triangle = this.getTriangleAt(pos);
    if (triangle) {
      const prevColor = triangle.shape ? triangle.shape.fillColor.toCSS(true) : null;
      if (prevColor !== color) {
        this.history.addAction(new FillTriangle(triangle, prevColor, color));
      }

      triangle.fill(color);
    }
  }
  eraseTriangleAt(pos) {
    const triangle = this.getTriangleAt(pos);
    if (triangle) {
      const prevColor = triangle.shape ? triangle.shape.fillColor.toCSS(true) : null;
      if (prevColor !== null) {
        this.history.addAction(new FillTriangle(triangle, prevColor, null));
      }

      triangle.erase();
    }
  }
  setBackgroundColor(color) {
    if (color === 'transparent' || color === null) {
      const prevColor = this.background.visible ? this.background.fillColor.toCSS(true) : null;

      if (prevColor !== color) {
        const ha = new ChangeBackgroundColor(this.background, prevColor, null);
        this.history.addAction(ha);
      }

      this.background.visible = false;
    } else {
      const prevColor = this.background.visible ? this.background.fillColor.toCSS(true) : null;

      if (prevColor !== color) {
        const ha = new ChangeBackgroundColor(this.background, prevColor, color);
        this.history.addAction(ha);
      }

      this.background.fillColor = color;
      this.background.visible = true;
    }

    Paper.view.draw();
  }
  getAllTriangles() {
    const triangles = [];
    this.grid.iterateCells((pos) => {
      const vals = _.values(this.grid.getGridValue(pos, triangles));
      triangles.push(vals);
    });

    return _.flatten(triangles);
  }
  getAllFilledTriangles() {
    return _.filter(this.getAllTriangles(), (t) => t.shape !== null);
  }
  getAllTrianglesInRectangle(rect) {
    const triangles = [];
    const leftTop = {x: rect.x, y: rect.y};
    const rightBottom = {x: rect.x + rect.width, y: rect.y + rect.height};

    let leftTopGridPos = this.grid.getGridPosition(leftTop);
    let rightBottomGridPos = this.grid.getGridPosition(rightBottom);

    if (!leftTopGridPos) {
      leftTopGridPos = {x: 0, y: 0};
    }

    if (!rightBottomGridPos) {
      rightBottomGridPos = {x: this.grid.width - 1, y: this.grid.height - 1};
    }

    for (let i = leftTopGridPos.x; i <= rightBottom.x; i++) {
      for (let j = leftTopGridPos.y; j <= rightBottom.y; j++) {
        triangles.push(_.values(this.grid.getGridValue({x: i, y: j})));
      }
    }

    return _.filter(_.flatten(triangles), (t) => t.isContainedIn(rect));
  }
  eraseAllTriangles() {
    const triangles = this.getAllFilledTriangles();
    const historyActions = [];

    _.each(triangles, (t) => {
      const prevColor = t.shape ? t.shape.fillColor.toCSS(true) : null;
      if (prevColor !== null) {
        historyActions.push(new FillTriangle(t, prevColor, null));
      }

      t.erase();
    });

    if (historyActions.length > 0) {
      this.history.addAction(historyActions);
    }
  }
  fillInRectangle(rect, color) {
    const triangles = this.getAllTrianglesInRectangle(rect);
    const historyActions = [];

    _.each(triangles, (t) => {
      const prevColor = t.shape ? t.shape.fillColor.toCSS(true) : null;
      if (prevColor !== color) {
        historyActions.push(new FillTriangle(t, prevColor, color));
      }

      t.fill(color);
    });

    if (historyActions.length > 0) {
      this.history.addAction(historyActions);
    }
  }
  eraseInRectangle(rect) {
    const triangles = this.getAllTrianglesInRectangle(rect);
    const historyActions = [];

    _.each(triangles, (t) => {
      const prevColor = t.shape ? t.shape.fillColor.toCSS(true) : null;
      if (prevColor !== null) {
        historyActions.push(new FillTriangle(t, prevColor, null));
      }
      t.erase();
    });

    if (historyActions.length > 0) {
      this.history.addAction(historyActions);
    }
  }
  undoAction() {
    const action = this.history.undo();

    if (!action) {
      return;
    }

    if (_.isArray(action)) {
      _.each(action, (a) => a.undo());
    } else {
      action.undo();
    }
  }
  redoAction() {
    const action = this.history.redo();

    if (!action) {
      return;
    }

    if (_.isArray(action)) {
      _.each(action, (a) => a.redo());
    } else {
      action.redo();
    }
  }
  hideGrid() {
    this.gridLines.visible = false;
    Paper.view.draw();
  }
  showGrid() {
    this.gridLines.visible = true;
    Paper.view.draw();
  }
  toDataUrl() {
    this.hideGrid();
    const res = this.element.toDataURL();
    this.showGrid();

    return res;
  }
  toSVG() {
    this.hideGrid();
    const res = this.canvas.project.exportSVG({asString: true});
    this.showGrid();

    return res;
  }
}

export default Editor;
