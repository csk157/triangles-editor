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

    expect(editor.gridLines.length).to.be.above(2);
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

  it('Erases the right triangle', () => {
    const el = new Canvas(200, 100);
    const editor = new Editor(el, {unitSize: 5});

    editor.fillTriangleAt({x: 7.5, y: 0.1}, '#FF0000');
    editor.eraseTriangleAt({x: 7.5, y: 0.1});

    const filledTriangle = editor.grid.getGridValue({x: 1, y: 0}).top;
    expect(filledTriangle.shape).to.be.null;
  });
});
