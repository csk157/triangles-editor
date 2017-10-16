import ChangeBackgroundColor from "../src/history_actions/ChangeBackgroundColor";

describe("ChangeBackgroundColor", () => {
  test("Assigns background, prev color and next color", () => {
    const editor = { background: "#000000" };
    const cbg = new ChangeBackgroundColor(editor, "#FF0000", "#000000");

    expect(cbg.previousColor).toEqual("#FF0000");
    expect(cbg.nextColor).toEqual("#000000");
  });

  test("Changes background color on undo", () => {
    const editor = { background: "#FF0000" };
    const cbg = new ChangeBackgroundColor(editor, "#FF0000", "#000000");
    cbg.undo();

    expect(editor.background).toEqual("#FF0000");
  });

  test("Changes background color on redo", () => {
    const editor = { background: "#FF0000" };
    const cbg = new ChangeBackgroundColor(editor, "#FF0000", "#000000");
    cbg.redo();

    expect(editor.background).toEqual("#000000");
  });
});
