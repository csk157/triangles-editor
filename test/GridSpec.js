/**
 * Babel Starter Kit | https://github.com/kriasoft/babel-starter-kit
 * Copyright (c) Konstantin Tarkus <hello@tarkus.me> | The MIT License
 */

import { describe, it } from 'mocha';
import { expect } from 'chai';
import Grid from '../src/Grid';

describe('Grid', () => {

  it('Creates right size grid', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    expect(grid.width).to.be.equal(10);
    expect(grid.height).to.be.equal(5);
  });

  it('Calculates the right real size', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const realSize = grid.getRealSize();

    expect(realSize.width).to.be.equal(50);
    expect(realSize.height).to.be.equal(25);
  });

  it('Finds the right grid position given real coordinates', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const realCoordinates = {x: 24, y: 9};
    const results = grid.getGridPosition(realCoordinates);

    expect(results).to.be.a('object');
    expect(results.x).to.be.equal(4);
    expect(results.y).to.be.equal(1);
  });

  it('Chooses the grid item to the right/bottom when in between', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const realCoordinates = {x: 25, y: 10};
    const results = grid.getGridPosition(realCoordinates);

    expect(results.x).to.be.equal(5);
    expect(results.y).to.be.equal(2);
  });

  it('Returns null when out of grid', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const realCoordinates = {x: 125, y: 310};
    const results = grid.getGridPosition(realCoordinates);

    expect(results).to.be.equal(null);
  });

  it('Sets value for grid position', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const coordinates = {x: 5, y: 2};
    const val = 'Awesome value';
    
    grid.setGridValue(coordinates, val);
    const results = grid.getGridValue(coordinates);

    expect(results).to.be.equal(val);
  });

  it('Getting value for empty position returns null', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const coordinates = {x: 5, y: 2};
    const results = grid.getGridValue(coordinates);

    expect(results).to.be.equal(null);
  });

  it('Gets right number of grid lines', () => {
    const grid = new Grid({width: 2, height: 2}, 5);
    const lines = grid.getLines();

    // 2 lines in between + 4 around
    expect(lines).to.be.a('array');
    expect(lines.length).to.be.equal(6);
  });

  it('Gets real cell rectangle coordinates', () => {
    const grid = new Grid({width: 2, height: 2}, 5);
    const rect = grid.getCellRealRectangle({x: 1, y: 1});

    // 2 lines in between + 4 around
    expect(rect).to.be.a('object');
    expect(rect.x).to.be.equal(5);
    expect(rect.y).to.be.equal(5);
    expect(rect.width).to.be.equal(5);
    expect(rect.height).to.be.equal(5);
  });  

  it('Iterates all cells', () => {
    const grid = new Grid({width: 2, height: 2}, 5);
    let count = 0;

    grid.iterateCells((cellPosition) => count++);
    expect(count).to.be.equal(4);
  });
});
