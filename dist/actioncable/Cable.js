"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Consumer = _interopRequireDefault(require("./Cable/Consumer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var CreateWebSocketURL = function CreateWebSocketURL(url) {
  if (url && !/^wss?:/i.test(url)) {
    var a = document.createElement('a');
    a.href = url;
    // Fix populating Location properties in IE. Otherwise, protocol will be blank.
    a.href = a.href;
    a.protocol = a.protocol.replace('http', 'ws');
    return a.href;
  }
  return url;
};
var _default = exports["default"] = {
  createConsumer: function createConsumer(url, options) {
    return new _Consumer["default"](CreateWebSocketURL(url), options);
  },
  endConsumer: function endConsumer(consumer) {
    consumer.connection.close();
    consumer.connection.disconnect();
    consumer.connectionMonitor.stop();
  }
};