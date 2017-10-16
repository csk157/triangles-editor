import flatten from "array-flatten";
import Grid from "./Grid";
import Triangle from "./Triangle";
import History from "./History";
import { FillTriangle, ChangeBackgroundColor } from "./history_actions";
import SvgBuilder from "./SvgBuilder";

class Editor {
  constructor({ unitSize, renderer, width, height }) {
    this.width = Math.floor(width / unitSize);
    this.height = Math.floor(height / unitSize);
    this.unitSize = unitSize;
    this.background = null;
    this.filledTriangles = [];

    this.isGridVisible = true;
    this.grid = new Grid(
      {
        width: this.width,
        height: this.height
      },
      unitSize
    );
    this.history = new History();
    this.renderer = renderer;
    this.renderer.setupGridLines(this.grid.getLines());
    this.createTriangles();
  }

  begin() {
    const loop = () => {
      this.renderer.render(this.filledTriangles);
      window.requestAnimationFrame(loop);
    };

    loop();
  }

  createTrianglesFromRect(rect) {
    const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    const topLeft = { x: rect.x, y: rect.y };
    const bottomLeft = { x: rect.x, y: rect.y + rect.height };
    const topRight = { x: rect.x + rect.width, y: rect.y };
    const bottomRight = { x: rect.x + rect.width, y: rect.y + rect.height };

    const leftTriangle = new Triangle(topLeft, center, bottomLeft);
    const topTriangle = new Triangle(topLeft, center, topRight);
    const rightTriangle = new Triangle(topRight, center, bottomRight);
    const bottomTriangle = new Triangle(bottomLeft, center, bottomRight);

    return {
      left: leftTriangle,
      right: rightTriangle,
      top: topTriangle,
      bottom: bottomTriangle
    };
  }

  createTriangles() {
    this.grid.iterateCells(pos => {
      const rect = this.grid.getCellRealRectangle(pos);
      const triangles = this.createTrianglesFromRect(rect);
      this.grid.setGridValue(pos, triangles);
    });
  }

  getTriangleAt(pos) {
    const gridPosition = this.grid.getGridPosition(pos);
    const gridValue = this.grid.getGridValue(gridPosition);
    const triangles = Object.values(gridValue);

    return triangles.find(triangle => triangle.isPointInside(pos));
  }

  fillTriangleAt(pos, color, alpha) {
    const triangle = this.getTriangleAt(pos);

    if (triangle) {
      const prevColor = triangle.fill;
      if (prevColor !== color) {
        this.history.addAction(new FillTriangle(triangle, prevColor, color));
      }

      triangle.fill = color;
      triangle.alpha = alpha;

      if (prevColor === null) {
        this.filledTriangles = [...this.filledTriangles, triangle];
      }
    }
  }

  eraseTriangleAt(pos) {
    const triangle = this.getTriangleAt(pos);
    if (triangle) {
      const prevColor = triangle.fill;
      if (prevColor !== null) {
        this.history.addAction(new FillTriangle(triangle, prevColor, null));
      }

      triangle.erase();

      if (prevColor) {
        this.filledTriangles = this.filledTriangles.filter(t => t !== triangle);
      }
    }
  }

  setBackgroundColor(color, alpha = 1) {
    if (color === "transparent" || color === null) {
      const prevColor = this.background;

      if (prevColor !== color) {
        const ha = new ChangeBackgroundColor(this, prevColor, null);
        this.history.addAction(ha);
      }

      this.background = null;
    } else {
      const prevColor = this.background;

      if (prevColor !== color) {
        const ha = new ChangeBackgroundColor(this, prevColor, color);
        this.history.addAction(ha);
      }

      this.background = color;
      this.backgroundAlpha = alpha;
    }

    this.renderer.setBackgroundColor(color, alpha);
  }

  getAllTriangles() {
    let triangles = [];
    this.grid.iterateCells(pos => {
      const vals = Object.values(this.grid.getGridValue(pos, triangles));
      triangles = [...triangles, ...vals];
    });

    return triangles;
  }

  getAllFilledTriangles() {
    return this.filledTriangles;
  }

  getAllTrianglesInRectangle(rect) {
    const leftTop = { x: rect.x, y: rect.y };
    const rightBottom = { x: rect.x + rect.width, y: rect.y + rect.height };

    let leftTopGridPos = this.grid.getGridPosition(leftTop);
    let rightBottomGridPos = this.grid.getGridPosition(rightBottom);

    if (!leftTopGridPos) {
      leftTopGridPos = { x: 0, y: 0 };
    }

    if (!rightBottomGridPos) {
      rightBottomGridPos = { x: this.grid.width - 1, y: this.grid.height - 1 };
    }

    const cells = this.grid.getInBetween(leftTopGridPos, rightBottomGridPos);
    const triangles = flatten(cells.map(c => Object.values(c)));
    // return triangles.filter((t) => t.isContainedIn(rect));
    return triangles.filter(t => t.isIntersectingWith(rect));
  }

  eraseAllTriangles() {
    const triangles = this.filledTriangles;
    const historyActions = [];

    triangles.forEach(t => {
      const prevColor = t.fill;
      if (prevColor !== null) {
        historyActions.push(new FillTriangle(t, prevColor, null));
      }

      t.erase();
    });

    if (historyActions.length > 0) {
      this.history.addAction(historyActions);
    }
  }

  fillInRectangle(rect, color, alpha) {
    const triangles = this.getAllTrianglesInRectangle(rect);
    const historyActions = [];
    const fills = [];

    triangles.forEach(t => {
      const prevColor = t.fill;
      const prevAlpha = t.alpha;

      if (prevColor !== color) {
        historyActions.push(new FillTriangle(t, prevColor, color));
      }

      t.fill = color;
      t.alpha = alpha;

      if (prevColor === null) {
        fills.push(t);
      }
    });

    this.filledTriangles = [...this.filledTriangles, ...fills];

    if (historyActions.length > 0) {
      this.history.addAction(historyActions);
    }
  }
  eraseInRectangle(rect) {
    const triangles = this.getAllTrianglesInRectangle(rect);
    const historyActions = [];
    const toRemove = new Set();

    triangles.forEach(t => {
      const prevColor = t.fill;
      if (prevColor !== null) {
        historyActions.push(new FillTriangle(t, prevColor, null));
      }

      t.erase();
      toRemove.add(t);
    });

    this.filledTriangles = this.filledTriangles.filter(t => !toRemove.has(t));

    if (historyActions.length > 0) {
      this.history.addAction(historyActions);
    }
  }
  undoAction() {
    const action = this.history.undo();

    if (!action) {
      return;
    }

    if (Array.isArray(action)) {
      action.forEach(a => a.undo());
    } else {
      action.undo();
    }
  }
  redoAction() {
    const action = this.history.redo();

    if (!action) {
      return;
    }

    if (Array.isArray(action)) {
      action.forEach(a => a.redo());
    } else {
      action.redo();
    }
  }

  hideGrid() {
    this.renderer.setGridVisible(false);
  }

  showGrid() {
    this.renderer.setGridVisible(true);
  }

  toDataURL() {
    return this.renderer.toDataURL();
  }

  toSVG() {
    return SvgBuilder({
      triangles: this.filledTriangles,
      bgColor: this.background,
      size: {
        width: this.width * this.unitSize,
        height: this.height * this.unitSize
      }
    });
  }
}

export default Editor;
