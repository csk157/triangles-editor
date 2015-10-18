import _ from 'underscore';
import Paper from 'paper';
import Grid from './Grid';
import Triangle from './Triangle';

class Editor {
  constructor(elem, {unitSize}) {
    this.grid = new Grid({
      width: Math.floor(elem.width / unitSize),
      height: Math.floor(elem.height / unitSize)}, unitSize);
    this.canvas = Paper.setup(elem);
    this.gridLines = [];
    this.drawGridLines();
    this.createTriangles();

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

}

export default Editor;
