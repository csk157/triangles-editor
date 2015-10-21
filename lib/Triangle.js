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

var Triangle = (function () {
  function Triangle(p1, p2, p3) {
    _classCallCheck(this, Triangle);

    this.points = [p1, p2, p3];
    this.shape = null;
  }

  _createClass(Triangle, [{
    key: 'isPointInside',
    value: function isPointInside(p) {
      var pA = this.points[0];
      var pB = this.points[1];
      var pC = this.points[2];

      // Calculate area of triangle ABC
      var a = Triangle.area(pA, pB, pC);

      // Calculate area of triangle PBC
      var a1 = Triangle.area(p, pB, pC);

      // Calculate area of triangle PAC
      var a2 = Triangle.area(pA, p, pC);

      // Calculate area of triangle PAB
      var a3 = Triangle.area(pA, pB, p);

      // Check if sum of A1, A2 and A3 is same as A
      return a === a1 + a2 + a3;
    }
  }, {
    key: 'erase',
    value: function erase() {
      if (this.shape) {
        this.shape.remove();
        this.shape = null;
      }
    }
  }, {
    key: 'fill',
    value: function fill(color) {
      this.erase();
      this.shape = new _paper.Path({
        segments: [new _paper.Point(this.points[0].x, this.points[0].y), new _paper.Point(this.points[1].x, this.points[1].y), new _paper.Point(this.points[2].x, this.points[2].y), new _paper.Point(this.points[0].x, this.points[0].y)],
        fillColor: color,
        strokeColor: color,
        strokeWidth: 1
      });
    }
  }, {
    key: 'isContainedIn',
    value: function isContainedIn(rect) {
      return _underscore2['default'].reduce(this.points, function (memo, p) {
        return memo && !(p.x < rect.x || p.y < rect.y || p.x > rect.x + rect.width || p.y > rect.y + rect.height);
      }, true);
    }
  }], [{
    key: 'area',
    value: function area(p1, p2, p3) {
      return Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2.0);
    }
  }]);

  return Triangle;
})();

exports['default'] = Triangle;
module.exports = exports['default'];