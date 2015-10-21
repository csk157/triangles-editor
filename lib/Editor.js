'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _paper = require('paper');

var _paper2 = _interopRequireDefault(_paper);

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Triangle = require('./Triangle');

var _Triangle2 = _interopRequireDefault(_Triangle);

var _History = require('./History');

var _History2 = _interopRequireDefault(_History);

var _history_actions = require('./history_actions');

var Editor = (function () {
  function Editor(elem, _ref) {
    var unitSize = _ref.unitSize;

    _classCallCheck(this, Editor);

    this.width = Math.floor(elem.width / unitSize);
    this.height = Math.floor(elem.height / unitSize);
    this.gridLines = null;
    this.background = null;

    this.grid = new _Grid2['default']({
      width: this.width,
      height: this.height
    }, unitSize);
    this.history = new _History2['default']();
    this.canvas = _paper2['default'].setup(elem);
    this.element = elem;
    this.drawGridLines();
    this.createTriangles();
    this.createBackground();

    _paper2['default'].view.draw();
  }

  _createClass(Editor, [{
    key: 'drawGridLines',
    value: function drawGridLines() {
      var lines = this.grid.getLines();
      var gridLines = _underscore2['default'].map(lines, function (l) {
        return new _paper2['default'].Path.Line({
          from: l.from,
          to: l.to,
          strokeColor: '#666'
        });
      });

      this.gridLines = new _paper2['default'].Group(gridLines);
    }
  }, {
    key: 'createBackground',
    value: function createBackground() {
      this.background = new _paper2['default'].Path.Rectangle({
        point: new _paper2['default'].Point(0, 0),
        size: new _paper2['default'].Size(this.width * this.unitSize, this.height * this.width * this.unitSize),
        fillColor: '#FF0000',
        visible: false
      });
    }
  }, {
    key: 'createTrianglesFromRect',
    value: function createTrianglesFromRect(rect) {
      var center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      var topLeft = { x: rect.x, y: rect.y };
      var bottomLeft = { x: rect.x, y: rect.y + rect.height };
      var topRight = { x: rect.x + rect.width, y: rect.y };
      var bottomRight = { x: rect.x + rect.width, y: rect.y + rect.height };

      var leftTriangle = new _Triangle2['default'](topLeft, center, bottomLeft);
      var topTriangle = new _Triangle2['default'](topLeft, center, topRight);
      var rightTriangle = new _Triangle2['default'](topRight, center, bottomRight);
      var bottomTriangle = new _Triangle2['default'](bottomLeft, center, bottomRight);

      return {
        left: leftTriangle,
        right: rightTriangle,
        top: topTriangle,
        bottom: bottomTriangle
      };
    }
  }, {
    key: 'createTriangles',
    value: function createTriangles() {
      var _this = this;

      this.grid.iterateCells(function (pos) {
        var rect = _this.grid.getCellRealRectangle(pos);
        var triangles = _this.createTrianglesFromRect(rect);
        _this.grid.setGridValue(pos, triangles);
      });
    }
  }, {
    key: 'getTriangleAt',
    value: function getTriangleAt(pos) {
      var gridPosition = this.grid.getGridPosition(pos);
      var gridValue = this.grid.getGridValue(gridPosition);
      var triangles = _underscore2['default'].values(gridValue);

      return _underscore2['default'].find(triangles, function (triangle) {
        return triangle.isPointInside(pos);
      });
    }
  }, {
    key: 'fillTriangleAt',
    value: function fillTriangleAt(pos, color) {
      var triangle = this.getTriangleAt(pos);
      if (triangle) {
        var prevColor = triangle.shape ? triangle.shape.fillColor.toCSS(true) : null;
        if (prevColor !== color) {
          this.history.addAction(new _history_actions.FillTriangle(triangle, prevColor, color));
        }

        triangle.fill(color);
      }
    }
  }, {
    key: 'eraseTriangleAt',
    value: function eraseTriangleAt(pos) {
      var triangle = this.getTriangleAt(pos);
      if (triangle) {
        var prevColor = triangle.shape ? triangle.shape.fillColor.toCSS(true) : null;
        if (prevColor !== null) {
          this.history.addAction(new _history_actions.FillTriangle(triangle, prevColor, null));
        }

        triangle.erase();
      }
    }
  }, {
    key: 'setBackgroundColor',
    value: function setBackgroundColor(color) {
      if (color === 'transparent' || color === null) {
        var prevColor = this.background.visible ? this.background.fillColor.toCSS(true) : null;

        if (prevColor !== color) {
          var ha = new _history_actions.ChangeBackgroundColor(this.background, prevColor, null);
          this.history.addAction(ha);
        }

        this.background.visible = false;
      } else {
        var prevColor = this.background.visible ? this.background.fillColor.toCSS(true) : null;

        if (prevColor !== color) {
          var ha = new _history_actions.ChangeBackgroundColor(this.background, prevColor, color);
          this.history.addAction(ha);
        }

        this.background.fillColor = color;
        this.background.visible = true;
      }
    }
  }, {
    key: 'getAllTriangles',
    value: function getAllTriangles() {
      var _this2 = this;

      var triangles = [];
      this.grid.iterateCells(function (pos) {
        var vals = _underscore2['default'].values(_this2.grid.getGridValue(pos, triangles));
        triangles.push(vals);
      });

      return _underscore2['default'].flatten(triangles);
    }
  }, {
    key: 'getAllFilledTriangles',
    value: function getAllFilledTriangles() {
      return _underscore2['default'].filter(this.getAllTriangles(), function (t) {
        return t.shape !== null;
      });
    }
  }, {
    key: 'getAllTrianglesInRectangle',
    value: function getAllTrianglesInRectangle(rect) {
      var triangles = [];
      var leftTop = { x: rect.x, y: rect.y };
      var rightBottom = { x: rect.x + rect.width, y: rect.y + rect.height };

      var leftTopGridPos = this.grid.getGridPosition(leftTop);
      var rightBottomGridPos = this.grid.getGridPosition(rightBottom);

      if (!leftTopGridPos) {
        leftTopGridPos = { x: 0, y: 0 };
      }

      if (!rightBottomGridPos) {
        rightBottomGridPos = { x: this.grid.width - 1, y: this.grid.height - 1 };
      }

      for (var i = leftTopGridPos.x; i <= rightBottom.x; i++) {
        for (var j = leftTopGridPos.y; j <= rightBottom.y; j++) {
          triangles.push(_underscore2['default'].values(this.grid.getGridValue({ x: i, y: j })));
        }
      }

      return _underscore2['default'].filter(_underscore2['default'].flatten(triangles), function (t) {
        return t.isContainedIn(rect);
      });
    }
  }, {
    key: 'eraseAllTriangles',
    value: function eraseAllTriangles() {
      var triangles = this.getAllFilledTriangles();
      var historyActions = [];

      _underscore2['default'].each(triangles, function (t) {
        var prevColor = t.shape ? t.shape.fillColor.toCSS(true) : null;
        if (prevColor !== null) {
          historyActions.push(new _history_actions.FillTriangle(t, prevColor, null));
        }

        t.erase();
      });

      if (historyActions.length > 0) {
        this.history.addAction(historyActions);
      }
    }
  }, {
    key: 'fillInRectangle',
    value: function fillInRectangle(rect, color) {
      var triangles = this.getAllTrianglesInRectangle(rect);
      var historyActions = [];

      _underscore2['default'].each(triangles, function (t) {
        var prevColor = t.shape ? t.shape.fillColor.toCSS(true) : null;
        if (prevColor !== color) {
          historyActions.push(new _history_actions.FillTriangle(t, prevColor, color));
        }

        t.fill(color);
      });

      if (historyActions.length > 0) {
        this.history.addAction(historyActions);
      }
    }
  }, {
    key: 'eraseInRectangle',
    value: function eraseInRectangle(rect) {
      var triangles = this.getAllTrianglesInRectangle(rect);
      var historyActions = [];

      _underscore2['default'].each(triangles, function (t) {
        var prevColor = t.shape ? t.shape.fillColor.toCSS(true) : null;
        if (prevColor !== null) {
          historyActions.push(new _history_actions.FillTriangle(t, prevColor, null));
        }
        t.erase();
      });

      if (historyActions.length > 0) {
        this.history.addAction(historyActions);
      }
    }
  }, {
    key: 'undoAction',
    value: function undoAction() {
      var action = this.history.undo();

      if (!action) {
        return;
      }

      if (_underscore2['default'].isArray(action)) {
        _underscore2['default'].each(action, function (a) {
          return a.undo();
        });
      } else {
        action.undo();
      }
    }
  }, {
    key: 'redoAction',
    value: function redoAction() {
      var action = this.history.redo();

      if (!action) {
        return;
      }

      if (_underscore2['default'].isArray(action)) {
        _underscore2['default'].each(action, function (a) {
          return a.redo();
        });
      } else {
        action.redo();
      }
    }
  }, {
    key: 'hideGrid',
    value: function hideGrid() {
      this.gridLines.visible = false;
    }
  }, {
    key: 'showGrid',
    value: function showGrid() {
      this.gridLines.visible = true;
    }
  }, {
    key: 'toDataUrl',
    value: function toDataUrl() {
      this.hideGrid();
      var res = this.element.toDataURL();
      this.showGrid();

      return res;
    }
  }, {
    key: 'toSVG',
    value: function toSVG() {
      this.hideGrid();
      var res = this.canvas.project.exportSVG({ asString: true });
      this.showGrid();

      return res;
    }
  }]);

  return Editor;
})();

exports['default'] = Editor;
module.exports = exports['default'];