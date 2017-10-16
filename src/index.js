import Renderer from "./Renderer.js";
import Editor from "./Editor.js";

export default Editor;

export function createWithElement(elem, { unitSize }) {
  const renderer = new Renderer(elem, {});
  return new Editor({
    unitSize,
    renderer,
    width: elem.width,
    height: elem.height
  });
}

if (window) {
  window.Editor = Editor;
  window.Editor.createWithElement = createWithElement;
}
