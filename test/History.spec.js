import History from '../src/History';

describe('History', () => {
  test('Creates empty action list', () => {
    const hist = new History();
    expect(hist.actions.length).toEqual(0);
    expect(hist.currentIndex).toEqual(-1);
  });

  test('Adds action to the list and increments', () => {
    const hist = new History();
    hist.addAction('action1');

    expect(hist.actions.length).toEqual(1);
    expect(hist.currentIndex).toEqual(0);
  });

  test('Overwrites next actions if current index is not last', () => {
    const hist = new History();
    hist.addAction('action1');
    hist.addAction('action2');
    hist.addAction('action3');
    hist.addAction('action4');

    expect(hist.currentIndex).toEqual(3);

    hist.currentIndex = 1;
    hist.addAction('overwrite');

    expect(hist.currentIndex).toEqual(2);
    expect(hist.actions.length).toEqual(3);
    expect(hist.actions[0]).toEqual('action1');
    expect(hist.actions[1]).toEqual('action2');
    expect(hist.actions[2]).toEqual('overwrite');
  });

  test('Undo does not break when called on empty history', () => {
    const hist = new History();
    expect(hist.undo()).toEqual(null);
  });

  test('Undo does not break when called on history without previous actions', () => {
    const hist = new History();
    hist.addAction('action1');

    hist.undo();
    const res = hist.undo();

    expect(res).toEqual(null);
  });

  test('Redo does not break when called on empty history', () => {
    const hist = new History();
    expect(hist.redo()).toEqual(null);
  });

  test('Redo does not break when called on history without next actions', () => {
    const hist = new History();
    hist.addAction('action1');
    hist.addAction('action2');
    hist.addAction('action3');

    const res = hist.redo();
    expect(res).toEqual(null);
    expect(hist.currentIndex).toEqual(2);
  });

  test('Undo returns current item and decrements index', () => {
    const hist = new History();
    hist.addAction('action1');
    hist.addAction('action2');
    hist.addAction('action3');

    const res = hist.undo();
    expect(hist.actions.length).toEqual(3);
    expect(hist.currentIndex).toEqual(1);
    expect(res).toEqual('action3');
  });

  test('Redo returns next item and increments index', () => {
    const hist = new History();
    hist.addAction('action1');
    hist.addAction('action2');
    hist.addAction('action3');

    hist.currentIndex = 1;

    const res = hist.redo();
    expect(hist.actions.length).toEqual(3);
    expect(hist.currentIndex).toEqual(2);
    expect(res).toEqual('action3');
  });
});
