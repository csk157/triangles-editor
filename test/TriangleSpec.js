import { describe, it } from 'mocha';
import { expect } from 'chai';
import Triangle from '../src/Triangle';

describe('Triangle', () => {
  it('Creates triangle with 3 points', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    expect(triangle.points.length).to.be.equal(3);
  });

  it('Calculates the right area of the triangle', () => {
    const area = Triangle.area({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    expect(area).to.be.equal(25);
  });

  it('Determines whether point is inside triangle', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    const pInside = {x: 5, y: 2};    
    const pOutside = {x: -5, y: 10};
    const pOnTheLine = {x: 5, y: 5};

    expect(triangle.isPointInside(pInside)).to.be.true;
    expect(triangle.isPointInside(pOnTheLine)).to.be.true;
    expect(triangle.isPointInside(pOutside)).to.be.false;
  });

  it('Draws a rectangle with the right color', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.fill('#FF0000');

    expect(triangle.shape).to.be.a('object');
    expect(triangle.shape.fillColor.toCSS(true).toLowerCase()).to.be.equal('#FF0000'.toLowerCase());
  });

  it('Changes fill color if drawn over', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.fill('#FF0000');
    triangle.fill('#FF00FF');

    expect(triangle.shape.fillColor.toCSS(true).toLowerCase()).to.be.equal('#FF00FF'.toLowerCase());
  });

  it('Removes the rectangle', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.fill('#FF0000');
    triangle.erase();

    expect(triangle.shape).to.be.null;
  });

  it('Does nothing if removed empty', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.erase();

    expect(triangle.shape).to.be.null;
  });
});
