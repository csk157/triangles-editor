/**
 * Babel Starter Kit | https://github.com/kriasoft/babel-starter-kit
 * Copyright (c) Konstantin Tarkus <hello@tarkus.me> | The MIT License
 */

import { describe, it } from 'mocha';
import Chai, { expect } from 'chai';
import spy from 'chai-spies';
import { Canvas } from 'paper';
import Editor from '../src/Editor';

Chai.use(spy);

describe('Editor', () => {

  it('Editor creates the right grid', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    expect(editor.grid).to.be.a('object');
    expect(editor.grid.width).to.be.equal(40);
    expect(editor.grid.height).to.be.equal(20);
  });
  
  it('Editor creates Paper instance', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    expect(editor.canvas).to.be.a('object');
  });

  it('Editor creates grid lines', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    expect(editor.gridLines).to.be.a('object');
  });

  it('Editor creates history', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    expect(editor.history).to.be.a('object');
  });

  it('drawGridLines calls Grid.getLines', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    Chai.spy.on(editor.grid, 'getLines');

    editor.drawGridLines();
    expect(editor.grid.getLines).to.have.been.called();
  });

  it('Creates 4 triangles for every grid cell', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});
    const gridCellValue = editor.grid.getGridValue({x: 0, y: 0});

    expect(gridCellValue).to.be.a('object');
    expect(gridCellValue.left).to.be.a('object');
    expect(gridCellValue.top).to.be.a('object');
    expect(gridCellValue.right).to.be.a('object');
    expect(gridCellValue.bottom).to.be.a('object');
  });

  it('Finds the right triangle', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    const triangle = editor.getTriangleAt({x: 7.5, y: 0.1});
    const expectedTriangle = editor.grid.getGridValue({x: 1, y: 0}).top;

    expect(triangle).to.be.equal(expectedTriangle);
  });

  it('Fills the right triangle', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    const filledTriangle = editor.grid.getGridValue({x: 1, y: 0}).top;

    expect(filledTriangle.shape.fillColor.toCSS(true).toLowerCase()).to.be.equal('#ff0000');
  });

  it('fillTriangleAt creates history action', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    expect(editor.history.actions.length).to.be.equal(1);
  });

  it('Erases the right triangle', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    editor.eraseTriangleAt({x: 7.5, y: 0.1});

    const filledTriangle = editor.grid.getGridValue({x: 1, y: 0}).top;
    expect(filledTriangle.shape).to.be.null;
  });


  it('eraseTriangleAt creates history action', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    editor.eraseTriangleAt({x: 7.5, y: 0.1});
    expect(editor.history.actions.length).to.be.equal(2);
  });

  it('Erases all the triangles', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    editor.fillTriangleAt({x: 7.5, y: 6.7}, '#FF0000');
    editor.eraseAllTriangles();

    expect(editor.getTriangleAt({x: 7.5, y: 0.1}).shape).to.be.null;
    expect(editor.getTriangleAt({x: 7.5, y: 6.7}).shape).to.be.null;
  });

  it('eraseAllTriangles creates single history action', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    editor.fillTriangleAt({x: 7.2, y: 6.1}, '#FF0000');
    editor.eraseAllTriangles();

    expect(editor.history.actions.length).to.be.equal(3);
  });

  it('Sets background', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.setBackgroundColor('#FF0000');
    expect(editor.background.fillColor.toCSS(true).toLowerCase()).to.be.equal('#ff0000');
  });

  it('setBackgroundColor to create history action', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.setBackgroundColor('#FF0000');
    expect(editor.history.actions.length).to.be.equal(1);
  });

  it('Sets transparent background', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.setBackgroundColor('transparent');
    expect(editor.background.visible).to.be.false;

    editor.setBackgroundColor('#FF0000');
    expect(editor.background.visible).to.be.true;
  });

  it('Fills triangles contained in the rectangle', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillInRectangle({x: -1, y: -1, width: 12, height: 12}, '#FF0000');
    expect(editor.getTriangleAt({x: 0.1, y: 2}).shape.fillColor.toCSS(true).toLowerCase()).to.be.equal('#ff0000');
    expect(editor.getTriangleAt({x: 10.1, y: 8.3}).shape).to.be.null;
  });

  it('fillInRectangle creates single history action', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillInRectangle({x: -1, y: -1, width: 12, height: 12}, '#FF0000');
    expect(editor.history.actions.length).to.be.equal(1);
  });

  it('Erases triangles contained in the rectangle', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillInRectangle({x: -1, y: -1, width: 12, height: 12}, '#FF0000');
    expect(editor.getTriangleAt({x: 0.1, y: 2}).shape.fillColor.toCSS(true).toLowerCase()).to.be.equal('#ff0000');
    expect(editor.getTriangleAt({x: 10.1, y: 8.3}).shape).to.be.null;

    editor.eraseInRectangle({x: -1, y: -1, width: 12, height: 12});
    expect(editor.getTriangleAt({x: 0.1, y: 2}).shape).to.be.null;
  });

  it('eraseInRectangle creates single history action', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillInRectangle({x: -1, y: -1, width: 12, height: 12}, '#FF0000');
    editor.eraseInRectangle({x: -1, y: -1, width: 12, height: 12});
    expect(editor.history.actions.length).to.be.equal(2);
  });

  it('undoAction undoes the action', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    editor.undoAction();
    const res = editor.getTriangleAt({x: 7.5, y: 0.1});

    expect(res.shape).to.be.null;
  });

  it('undoAction undoes array of actions', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    editor.fillTriangleAt({x: 7.5, y: 6.7}, '#FF0000');
    editor.eraseAllTriangles();
    editor.undoAction();

    expect(editor.getTriangleAt({x: 7.5, y: 0.1}).shape.fillColor.toCSS(true).toLowerCase()).to.be.equal('#ff0000');
    expect(editor.getTriangleAt({x: 7.5, y: 6.7}).shape.fillColor.toCSS(true).toLowerCase()).to.be.equal('#ff0000');
  });

  it('redoAction redoes array of actions', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    editor.fillTriangleAt({x: 7.5, y: 6.7}, '#FF0000');
    editor.eraseAllTriangles();
    editor.undoAction();
    editor.redoAction();

    expect(editor.getTriangleAt({x: 7.5, y: 0.1}).shape).to.be.null;
    expect(editor.getTriangleAt({x: 7.5, y: 6.7}).shape).to.be.null;
  });

  it('hideGrid hides the grid', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.hideGrid()
    expect(editor.gridLines.visible).to.be.false;
  });

  it('showGrid hides the grid', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.showGrid()
    expect(editor.gridLines.visible).to.be.true;
  });

  it('toDataUrl hides grid and shows again', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    Chai.spy.on(editor, 'hideGrid');
    Chai.spy.on(editor, 'showGrid');

    const res = editor.toDataUrl();
    expect(editor.hideGrid).to.have.been.called();
    expect(editor.showGrid).to.have.been.called();
    expect(res).to.be.a('string');
  });

  it('toSVG hides grid and shows again', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    Chai.spy.on(editor, 'hideGrid');
    Chai.spy.on(editor, 'showGrid');

    const res = editor.toSVG();
    expect(editor.hideGrid).to.have.been.called();
    expect(editor.showGrid).to.have.been.called();
    expect(res).to.be.a('string');
  });
});
