import sinon from "sinon";
import Editor from "../src/Editor";

describe("Editor", () => {
  let renderer;
  let editor;

  beforeEach(() => {
    renderer = {
      render: () => {},
      setupGridLines: () => {},
      setBackgroundColor: sinon.spy()
    };

    editor = new Editor({
      renderer,
      unitSize: 5,
      width: 200,
      height: 100
    });
  });

  test("Editor creates the right grid", () => {
    expect(editor.grid.width).toEqual(40);
    expect(editor.grid.height).toEqual(20);
  });

  test("Finds the right triangle", () => {
    const triangle = editor.getTriangleAt({ x: 7.5, y: 0.1 });
    const expectedTriangle = editor.grid.getGridValue({ x: 1, y: 0 }).top;

    expect(triangle).toEqual(expectedTriangle);
  });

  test("Fills the right triangle", () => {
    editor.fillTriangleAt({ x: 7.5, y: 0.1 }, "#FF0000");
    const filledTriangle = editor.grid.getGridValue({ x: 1, y: 0 }).top;

    expect(filledTriangle.fill).toEqual("#FF0000");
  });

  test("fillTriangleAt creates history action", () => {
    editor.fillTriangleAt({ x: 7.5, y: 0.1 }, "#FF0000");
    expect(editor.history.actions.length).toEqual(1);
  });

  test("Erases the right triangle", () => {
    editor.fillTriangleAt({ x: 7.5, y: 0.1 }, "#FF0000");
    editor.eraseTriangleAt({ x: 7.5, y: 0.1 });

    const filledTriangle = editor.grid.getGridValue({ x: 1, y: 0 }).top;
    expect(filledTriangle.fill).toEqual(null);
  });

  test("eraseTriangleAt creates history action", () => {
    editor.fillTriangleAt({ x: 7.5, y: 0.1 }, "#FF0000");
    editor.eraseTriangleAt({ x: 7.5, y: 0.1 });
    expect(editor.history.actions.length).toEqual(2);
  });

  test("Erases all the triangles", () => {
    editor.fillTriangleAt({ x: 7.5, y: 0.1 }, "#FF0000");
    editor.fillTriangleAt({ x: 7.5, y: 6.7 }, "#FF0000");
    editor.eraseAllTriangles();

    expect(editor.getTriangleAt({ x: 7.5, y: 0.1 }).fill).toEqual(null);
    expect(editor.getTriangleAt({ x: 7.5, y: 6.7 }).fill).toEqual(null);
  });

  test("eraseAllTriangles creates single history action", () => {
    editor.fillTriangleAt({ x: 7.5, y: 0.1 }, "#FF0000");
    editor.fillTriangleAt({ x: 7.2, y: 6.1 }, "#FF0000");
    editor.eraseAllTriangles();

    expect(editor.history.actions.length).toEqual(3);
  });

  test("Sets background color", () => {
    editor.setBackgroundColor(0xff0000, 1);
    expect(editor.background).toEqual(0xff0000);
    expect(editor.backgroundAlpha).toEqual(1);
    expect(renderer.setBackgroundColor.calledWith(0xff0000, 1));
  });

  test("setBackgroundColor to create history action", () => {
    editor.setBackgroundColor("#FF0000");
    expect(editor.history.actions.length).toEqual(1);
  });

  test("Fills triangles contained in the rectangle", () => {
    editor.fillInRectangle({ x: -1, y: -1, width: 8, height: 8 }, 0xff0000);
    expect(editor.getTriangleAt({ x: 0.1, y: 2 }).fill).toEqual(0xff0000);
    expect(editor.getTriangleAt({ x: 6, y: 5 }).fill).toEqual(0xff0000);
    expect(editor.getTriangleAt({ x: 12.1, y: 12.3 }).fill).toEqual(null);
  });

  test("fillInRectangle creates single history action", () => {
    editor.fillInRectangle({ x: -1, y: -1, width: 12, height: 12 }, "#FF0000");
    expect(editor.history.actions.length).toEqual(1);
  });

  test("Erases triangles contained in the rectangle", () => {
    editor.fillInRectangle({ x: -1, y: -1, width: 8, height: 8 }, 0xff0000);
    expect(editor.getTriangleAt({ x: 0.1, y: 2 }).fill).toEqual(0xff0000);
    expect(editor.getTriangleAt({ x: 10.1, y: 8.3 }).fill).toEqual(null);

    editor.eraseInRectangle({ x: -1, y: -1, width: 8, height: 8 });
    expect(editor.getTriangleAt({ x: 0.1, y: 2 }).fill).toEqual(null);
  });

  test("eraseInRectangle creates single history action", () => {
    editor.fillInRectangle({ x: -1, y: -1, width: 12, height: 12 }, "#FF0000");
    editor.eraseInRectangle({ x: -1, y: -1, width: 12, height: 12 });
    expect(editor.history.actions.length).toEqual(2);
  });

  test("undoAction undoes the action", () => {
    editor.fillTriangleAt({ x: 7.5, y: 0.1 }, "#FF0000");
    editor.undoAction();
    const res = editor.getTriangleAt({ x: 7.5, y: 0.1 });

    expect(res.fill).toEqual(null);
  });

  test("undoAction undoes array of actions", () => {
    editor.fillTriangleAt({ x: 7.5, y: 0.1 }, "#FF0000");
    editor.fillTriangleAt({ x: 7.5, y: 6.7 }, "#FF0000");
    editor.eraseAllTriangles();
    editor.undoAction();

    expect(editor.getTriangleAt({ x: 7.5, y: 0.1 }).fill).toEqual("#FF0000");
    expect(editor.getTriangleAt({ x: 7.5, y: 6.7 }).fill).toEqual("#FF0000");
  });

  test("redoAction redoes array of actions", () => {
    editor.fillTriangleAt({ x: 7.5, y: 0.1 }, "#FF0000");
    editor.fillTriangleAt({ x: 7.5, y: 6.7 }, "#FF0000");
    editor.eraseAllTriangles();
    editor.undoAction();
    editor.redoAction();

    expect(editor.getTriangleAt({ x: 7.5, y: 0.1 }).fill).toEqual(null);
    expect(editor.getTriangleAt({ x: 7.5, y: 6.7 }).fill).toEqual(null);
  });

  test("hideGrid hides the grid", () => {
    renderer.setGridVisible = sinon.spy();
    editor.hideGrid();

    expect(renderer.setGridVisible.calledWith(false)).toEqual(true);
  });

  test("showGrid shows the grid", () => {
    renderer.setGridVisible = sinon.spy();
    editor.showGrid();

    expect(renderer.setGridVisible.calledWith(true)).toEqual(true);
  });
});
