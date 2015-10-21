'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _EditorJs = require('./Editor.js');

var _EditorJs2 = _interopRequireDefault(_EditorJs);

exports['default'] = _EditorJs2['default'];

if (window) {
  window.Editor = _EditorJs2['default'];
}
module.exports = exports['default'];