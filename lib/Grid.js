"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = (function () {
  function Grid(_ref, unitSize) {
    var width = _ref.width;
    var height = _ref.height;

    _classCallCheck(this, Grid);

    this.width = width;
    this.height = height;
    this.unitSize = unitSize;
    this.values = {};
  }

  _createClass(Grid, [{
    key: "iterateCells",
    value: function iterateCells(fn) {
      for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
          fn({ x: i, y: j });
        }
      }
    }
  }, {
    key: "getRealSize",
    value: function getRealSize() {
      return {
        width: this.width * this.unitSize,
        height: this.height * this.unitSize
      };
    }
  }, {
    key: "isRealPositionOutside",
    value: function isRealPositionOutside(realCoordinates) {
      var realSize = this.getRealSize();
      return !realCoordinates || realSize.width <= realCoordinates.x || realCoordinates.x < 0 || realSize.height <= realCoordinates.y || realCoordinates.y < 0;
    }
  }, {
    key: "isPositionOutside",
    value: function isPositionOutside(coordinates) {
      return !coordinates || this.width < coordinates.x || coordinates.x < 0 || this.height < coordinates.y || coordinates.y < 0;
    }
  }, {
    key: "getGridPosition",
    value: function getGridPosition(realCoordinates) {
      if (this.isRealPositionOutside(realCoordinates)) {
        return null;
      }

      return {
        x: Math.floor(realCoordinates.x / this.unitSize),
        y: Math.floor(realCoordinates.y / this.unitSize)
      };
    }
  }, {
    key: "setGridValue",
    value: function setGridValue(coordinates, value) {
      if (this.isPositionOutside(coordinates)) {
        return;
      }

      this.values[coordinates.x + "-" + coordinates.y] = value;
    }
  }, {
    key: "getGridValue",
    value: function getGridValue(coordinates) {
      if (this.isPositionOutside(coordinates)) {
        return null;
      }

      var res = this.values[coordinates.x + "-" + coordinates.y];
      return res !== undefined ? res : null;
    }
  }, {
    key: "getCellRealRectangle",
    value: function getCellRealRectangle(coordinates) {
      if (this.isPositionOutside(coordinates)) {
        return null;
      }

      return {
        x: coordinates.x * this.unitSize,
        y: coordinates.y * this.unitSize,
        width: this.unitSize,
        height: this.unitSize
      };
    }
  }, {
    key: "getLines",
    value: function getLines() {
      if (this.width <= 0 || this.height <= 0) {
        return [];
      }

      var results = [];
      var size = this.getRealSize();

      for (var i = 1; i < this.width; i++) {
        var line = {
          from: { x: i * this.unitSize, y: 0 },
          to: { x: i * this.unitSize, y: size.height }
        };

        results.push(line);
      }

      for (var i = 1; i < this.height; i++) {
        var line = {
          from: { x: 0, y: i * this.unitSize },
          to: { x: size.width, y: i * this.unitSize }
        };

        results.push(line);
      }

      // create borders
      var topLine = {
        from: { x: 0, y: 0 },
        to: { x: size.width, y: 0 }
      };
      var bottomLine = {
        from: { x: 0, y: size.height },
        to: { x: size.width, y: size.height }
      };
      var leftLine = {
        from: { x: 0, y: 0 },
        to: { x: 0, y: size.height }
      };
      var rigthLine = {
        from: { x: size.width, y: 0 },
        to: { x: size.width, y: size.height }
      };

      results.push(topLine);
      results.push(bottomLine);
      results.push(leftLine);
      results.push(rigthLine);

      return results;
    }
  }]);

  return Grid;
})();

exports["default"] = Grid;
module.exports = exports["default"];