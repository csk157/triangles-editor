"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var History = (function () {
  function History() {
    _classCallCheck(this, History);

    this.actions = [];
    this.currentIndex = -1;
  }

  _createClass(History, [{
    key: "addAction",
    value: function addAction(action) {
      this.actions = this.actions.slice(0, this.currentIndex + 1);
      this.actions.push(action);
      this.currentIndex++;
    }
  }, {
    key: "undo",
    value: function undo() {
      if (this.actions.length === 0 || this.currentIndex === -1) {
        return null;
      }

      var res = this.actions[this.currentIndex];
      this.currentIndex--;

      return res;
    }
  }, {
    key: "redo",
    value: function redo() {
      if (this.actions.length === 0 || this.currentIndex + 1 >= this.actions.length) {
        return null;
      }

      this.currentIndex++;
      return this.actions[this.currentIndex];
    }
  }]);

  return History;
})();

exports["default"] = History;
module.exports = exports["default"];