"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Debugging = null;
var _default = exports["default"] = {
  startDebugging: function startDebugging() {
    Debugging = true;
  },
  stopDebugging: function stopDebugging() {
    Debugging = null;
  },
  log: function log() {
    if (Debugging) {
      var _console;
      for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
        messages[_key] = arguments[_key];
      }
      messages.push(Date.now());
      return (_console = console).log.apply(_console, ['[ActionCable]'].concat(messages)); // eslint-disable-line no-console
    }
    return true;
  }
};