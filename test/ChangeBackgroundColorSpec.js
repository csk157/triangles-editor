import { describe, it } from 'mocha';
import { expect } from 'chai';
import Paper, { Canvas, Path, Point, Size } from 'paper';
import ChangeBackgroundColor from '../src/history_actions/ChangeBackgroundColor';

describe('ChangeBackgroundColor', () => {
  before(() => {
    const canvas = new Canvas(100, 100);
    const paper = Paper.setup(canvas);
  });
  
  it('Assigns background, prev color and next color', () => {
    const background = new Path.Rectangle({
      point: new Point(0, 0),
      size: new Size(10, 10),
      fillColor: '#000000'
    });

    const cbg = new ChangeBackgroundColor(background, '#FF0000', '#000000');
    
    expect(cbg.background).to.be.a('object');
    expect(cbg.previousColor).to.be.equal('#FF0000');
    expect(cbg.nextColor).to.be.equal('#000000');
  });

  it('Changes background color on undo', () => {
    const background = new Path.Rectangle({
      point: new Point(0, 0),
      size: new Size(10, 10),
      fillColor: '#000000'
    });

    const cbg = new ChangeBackgroundColor(background, '#FF0000', '#000000');
    cbg.undo();

    expect(cbg.background.fillColor.toCSS(true).toLowerCase()).to.be.equal('#ff0000');
  });

  it('Changes background color on redo', () => {
    const background = new Path.Rectangle({
      point: new Point(0, 0),
      size: new Size(10, 10),
      fillColor: '#FF0000'
    });

    const cbg = new ChangeBackgroundColor(background, '#FF0000', '#000000');
    cbg.redo();

    expect(cbg.background.fillColor.toCSS(true).toLowerCase()).to.be.equal('#000000');
  });

  it('Makes background transparent if color is null on undo', () => {
    const background = new Path.Rectangle({
      point: new Point(0, 0),
      size: new Size(10, 10),
      fillColor: '#000000'
    });

    const cbg = new ChangeBackgroundColor(background, null, '#000000');
    
    expect(cbg.background.visible).to.be.true;
    cbg.undo();
    expect(cbg.background.visible).to.be.false;
  });

  it('Makes background transparent if color is null on redo', () => {
    const background = new Path.Rectangle({
      point: new Point(0, 0),
      size: new Size(10, 10),
      fillColor: '#000000'
    });

    const cbg = new ChangeBackgroundColor(background, '#FF0000', null);
    
    expect(cbg.background.visible).to.be.true;
    cbg.redo();
    expect(cbg.background.visible).to.be.false;
  });
});
