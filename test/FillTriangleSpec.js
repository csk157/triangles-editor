import { describe, it } from 'mocha';
import { expect } from 'chai';
import Triangle from '../src/Triangle';
import FillTriangle from '../src/history_actions/FillTriangle';

describe('FillTriangle', () => {
  it('Assigns triangle, prev color and next color', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    const ft = new FillTriangle(triangle, '#FF0000', '#000000');
    
    expect(ft.triangle).to.be.a('object');
    expect(ft.previousColor).to.be.equal('#FF0000');
    expect(ft.nextColor).to.be.equal('#000000');
  });

  it('Changes triangle color on undo', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.fill('#000000');

    const ft = new FillTriangle(triangle, '#FF0000', '#000000');
    ft.undo();

    expect(triangle.shape.fillColor.toCSS(true).toLowerCase()).to.be.equal('#ff0000');
  });

  it('Changes triangle color on redo', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.fill('#FF0000');

    const ft = new FillTriangle(triangle, '#FF0000', '#000000');
    ft.redo();

    expect(triangle.shape.fillColor.toCSS(true).toLowerCase()).to.be.equal('#000000');
  });

  it('Erases triangle if color is null on undo', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.fill('#000000');

    const ft = new FillTriangle(triangle, null, '#000000');
    ft.undo();

    expect(triangle.shape).to.be.null;
  });

  it('Erases triangle if color is null on redo', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.fill('#FF0000');

    const ft = new FillTriangle(triangle, '#FF0000', null);
    ft.redo();

    expect(triangle.shape).to.be.null;
  });
});
