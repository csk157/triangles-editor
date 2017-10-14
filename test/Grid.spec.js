import Grid from '../src/Grid';

describe('Grid', () => {

  test('Creates right size grid', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    expect(grid.width).toEqual(10);
    expect(grid.height).toEqual(5);
  });

  test('Calculates the right real size', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const realSize = grid.getRealSize();

    expect(realSize.width).toEqual(50);
    expect(realSize.height).toEqual(25);
  });

  test('Finds the right grid position given real coordinates', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const realCoordinates = {x: 24, y: 9};
    const results = grid.getGridPosition(realCoordinates);

    expect(results.x).toEqual(4);
    expect(results.y).toEqual(1);
  });

  test('Chooses the grid item to the right/bottom when in between', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const realCoordinates = {x: 25, y: 10};
    const results = grid.getGridPosition(realCoordinates);

    expect(results.x).toEqual(5);
    expect(results.y).toEqual(2);
  });

  test('Returns null when out of grid', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const realCoordinates = {x: 125, y: 310};
    const results = grid.getGridPosition(realCoordinates);

    expect(results).toEqual(null);
  });

  test('Sets value for grid position', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const coordinates = {x: 5, y: 2};
    const val = 'Awesome value';

    grid.setGridValue(coordinates, val);
    const results = grid.getGridValue(coordinates);

    expect(results).toEqual(val);
  });

  test('Getting value for empty position returns null', () => {
    const grid = new Grid({width: 10, height: 5}, 5);
    const coordinates = {x: 5, y: 2};
    const results = grid.getGridValue(coordinates);

    expect(results).toEqual(null);
  });

  test('Gets right number of grid lines', () => {
    const grid = new Grid({width: 2, height: 2}, 5);
    const lines = grid.getLines();

    // 2 lines in between + 4 around
    expect(Array.isArray(lines)).toEqual(true);
    expect(lines.length).toEqual(6);
  });

  test('Gets real cell rectangle coordinates', () => {
    const grid = new Grid({width: 2, height: 2}, 5);
    const rect = grid.getCellRealRectangle({x: 1, y: 1});

    // 2 lines in between + 4 around
    expect(rect.x).toEqual(5);
    expect(rect.y).toEqual(5);
    expect(rect.width).toEqual(5);
    expect(rect.height).toEqual(5);
  });

  test('Iterates all cells', () => {
    const grid = new Grid({width: 2, height: 2}, 5);
    let count = 0;

    grid.iterateCells((cellPosition) => count++);
    expect(count).toEqual(4);
  });
});
