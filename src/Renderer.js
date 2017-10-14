import { Graphics, Container } from 'pixi.js';

export default class Renderer {
  constructor(elem, { backgroundColor }) {
    this.element = elem;
    this.renderer = PIXI.autoDetectRenderer(
      {
        width: elem.clientWidth,
        height: elem.clientHeight,
        view: elem,
        transparent: true
      });
    this.stage = new Container();
    this.background = this.createBackground(backgroundColor || 0xEFEFEF);
    this.gridLines = null;
    this.drawing = new Graphics();

    this.stage.addChild(this.background);
    this.stage.addChild(this.drawing);
  }

  setupGridLines(gridLines) {
    this.gridLines = this.createGridLines(gridLines);
    this.stage.addChild(this.gridLines);
  }

  setBackgroundColor(color, alpha) {
    this.background.clear();

    if (!color) {
      return;
    }

    this.background.beginFill(color, alpha);
    this.background.drawRect(0, 0, this.renderer.width, this.renderer.height);
    this.background.endFill();
  }

  createBackground(color, alpha) {
    const rectangle = new Graphics();

    rectangle.beginFill(color, alpha);
    rectangle.drawRect(0, 0, this.renderer.width, this.renderer.height);
    rectangle.endFill();

    return rectangle;
  }

  createGridLines(lines) {
    const gridLines = new Graphics();
    gridLines.lineStyle(1, 0x666666, 1);

    lines.forEach(({from, to}) => {
      gridLines.moveTo(from.x, from.y);
      gridLines.lineTo(to.x, to.y);
    });

    return gridLines;
  }

  setGridVisible(visible) {
    this.gridLines.visible = visible;
  }

  isGridVisible() {
    return gridLines.visible;
  }

  drawTriangles(triangles) {
    this.drawing.clear();

    triangles.forEach(t => {
      this.drawing.beginFill(t.fill, t.alpha);
      this.drawing.drawPolygon([
        t.points[0].x, t.points[0].y,
        t.points[1].x, t.points[1].y,
        t.points[2].x, t.points[2].y
      ]);
      this.drawing.endFill();
    });
  }

  render(triangles) {
    this.drawTriangles(triangles);
    this.renderer.render(this.stage);
  }

  toDataURL() {
    this.renderer.render(this.stage);
    return this.element.toDataURL();
  }
}
