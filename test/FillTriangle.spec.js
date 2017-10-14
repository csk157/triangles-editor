import Triangle from '../src/Triangle';
import FillTriangle from '../src/history_actions/FillTriangle';

describe('FillTriangle', () => {
  test('Assigns triangle, prev color and next color', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    const ft = new FillTriangle(triangle, '#FF0000', '#000000');

    expect(ft.previousColor).toEqual('#FF0000');
    expect(ft.nextColor).toEqual('#000000');
  });

  test('Changes triangle color on undo', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.fill = '#000000';

    const ft = new FillTriangle(triangle, '#FF0000', '#000000');
    ft.undo();

    expect(triangle.fill).toEqual('#FF0000');
  });

  test('Changes triangle color on redo', () => {
    const triangle = new Triangle({x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 0});
    triangle.fill = '#FF0000';

    const ft = new FillTriangle(triangle, '#FF0000', '#000000');
    ft.redo();

    expect(triangle.fill).toEqual('#000000');
  });
});
