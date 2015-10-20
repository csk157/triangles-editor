import { describe, it } from 'mocha';
import { expect } from 'chai';
import History from '../src/History';

describe('History', () => {
  it('Creates empty action list', () => {
    const hist = new History();
    expect(hist.actions).to.be.a('array');
    expect(hist.actions.length).to.be.equal(0);
    expect(hist.currentIndex).to.be.equal(-1);
  });

  it('Adds action to the list and increments', () => {
    const hist = new History();
    hist.addAction('action1');

    expect(hist.actions.length).to.be.equal(1);
    expect(hist.currentIndex).to.be.equal(0);
  });

  it('Overwrites next actions if current index is not last', () => {
    const hist = new History();
    hist.addAction('action1');
    hist.addAction('action2');
    hist.addAction('action3');
    hist.addAction('action4');

    expect(hist.currentIndex).to.be.equal(3);

    hist.currentIndex = 1;
    hist.addAction('overwrite');

    expect(hist.currentIndex).to.be.equal(2);
    expect(hist.actions.length).to.be.equal(3);
    expect(hist.actions[0]).to.be.equal('action1');
    expect(hist.actions[1]).to.be.equal('action2');
    expect(hist.actions[2]).to.be.equal('overwrite');
  });

  it('Undo does not break when called on empty history', () => {
    const hist = new History();
    expect(hist.undo()).to.be.null;
  });

  it('Undo does not break when called on history without previous actions', () => {
    const hist = new History();
    hist.addAction('action1');

    hist.undo();
    const res = hist.undo();

    expect(res).to.be.null;
  });

  it('Redo does not break when called on empty history', () => {
    const hist = new History();
    expect(hist.redo()).to.be.null;
  });

  it('Redo does not break when called on history without next actions', () => {
    const hist = new History();
    hist.addAction('action1');
    hist.addAction('action2');
    hist.addAction('action3');

    const res = hist.redo();
    expect(res).to.be.null;
    expect(hist.currentIndex).to.be.equal(2);
  });

  it('Undo returns current item and decrements index', () => {
    const hist = new History();
    hist.addAction('action1');
    hist.addAction('action2');
    hist.addAction('action3');

    const res = hist.undo();
    expect(hist.actions.length).to.be.equal(3);
    expect(hist.currentIndex).to.be.equal(1);
    expect(res).to.be.equal('action3');
  });

  it('Redo returns next item and increments index', () => {
    const hist = new History();
    hist.addAction('action1');
    hist.addAction('action2');
    hist.addAction('action3');

    hist.currentIndex = 1;

    const res = hist.redo();
    expect(hist.actions.length).to.be.equal(3);
    expect(hist.currentIndex).to.be.equal(2);
    expect(res).to.be.equal('action3');
  });
});
