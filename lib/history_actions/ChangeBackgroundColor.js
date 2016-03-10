'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _HistoryAction2 = require('./HistoryAction');

var _HistoryAction3 = _interopRequireDefault(_HistoryAction2);

var ChangeBackgroundColor = (function (_HistoryAction) {
  _inherits(ChangeBackgroundColor, _HistoryAction);

  function ChangeBackgroundColor(background) {
    var previousColor = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var nextColor = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, ChangeBackgroundColor);

    _get(Object.getPrototypeOf(ChangeBackgroundColor.prototype), 'constructor', this).call(this);
    this.background = background;
    this.previousColor = previousColor;
    this.nextColor = nextColor;
  }

  _createClass(ChangeBackgroundColor, [{
    key: 'undo',
    value: function undo() {
      _get(Object.getPrototypeOf(ChangeBackgroundColor.prototype), 'undo', this).call(this);
      if (this.previousColor) {
        this.background.fillColor = this.previousColor;
        this.background.visible = true;
      } else {
        this.background.visible = false;
      }
    }
  }, {
    key: 'redo',
    value: function redo() {
      _get(Object.getPrototypeOf(ChangeBackgroundColor.prototype), 'redo', this).call(this);
      if (this.nextColor) {
        this.background.fillColor = this.nextColor;
        this.background.visible = true;
      } else {
        this.background.visible = false;
      }
    }
  }]);

  return ChangeBackgroundColor;
})(_HistoryAction3['default']);

exports['default'] = ChangeBackgroundColor;
module.exports = exports['default'];