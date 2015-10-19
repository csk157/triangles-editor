import _ from 'underscore';
import Paper from 'paper';
import Grid from './Grid';
import Triangle from './Triangle';

class Editor {
  constructor(elem, {unitSize}) {
    this.width = Math.floor(elem.width / unitSize);
    this.height = Math.floor(elem.height / unitSize);
    this.gridLines = [];
    this.background = null;

    this.grid = new Grid({
      width: this.width,
      height: this.height,
    }, unitSize);
    this.canvas = Paper.setup(elem);
    this.drawGridLines();
    this.createTriangles();
    this.createBackground();

    Paper.view.draw();
  }

  drawGridLines() {
    const lines = this.grid.getLines();
    _.each(lines, (l) => {
      const line = new Paper.Path.Line({
        from: l.from,
        to: l.to,
        strokeColor: '#666',
      });

      this.gridLines.push(line);
    });
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
      triangle.fill(color);
    }
  }
  eraseTriangleAt(pos) {
    const triangle = this.getTriangleAt(pos);
    if (triangle) {
      triangle.erase();
    }
  }
  setBackgroundColor(color) {
    if (color === 'transparent') {
      this.background.visible = false;
    } else {
      this.background.fillColor = color;
      this.background.visible = true;
    }
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
    _.each(triangles, (t) => t.erase());
  }
  fillInRectangle(rect, color) {
    const triangles = this.getAllTrianglesInRectangle(rect);
    _.each(triangles, (t) => t.fill(color));
  }
  eraseInRectangle(rect) {
    const triangles = this.getAllTrianglesInRectangle(rect);
    _.each(triangles, (t) => t.erase());
  }
}

export default Editor;
