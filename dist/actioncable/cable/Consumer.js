"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Subscriptions = _interopRequireDefault(require("./Subscriptions"));
var _Connection = _interopRequireDefault(require("./Connection"));
var _ConnectionMonitor = _interopRequireDefault(require("./ConnectionMonitor"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /*
# The Cable.Consumer establishes the connection to a server-side Ruby
  Connection object. Once established,
# the Cable.ConnectionMonitor will ensure that its properly maintained through
  heartbeats and checking for stale updates.
# The Consumer instance is also the gateway to establishing subscriptions to
  desired channels through the #createSubscription
# method.
#
# The following example shows how this can be setup:
#
#   @App = {}
#   App.cable = Cable.createConsumer "ws://example.com/accounts/1"
#   App.appearance = App.cable.subscriptions.create "AppearanceChannel"
#
# For more details on how you'd configure an actual channel subscription, see Cable.Subscription.
*/
var Consumer = /*#__PURE__*/function () {
  function Consumer(url, options) {
    _classCallCheck(this, Consumer);
    this.options = options || {};
    this.url = url;
    this.subscriptions = new _Subscriptions["default"](this);
    this.connection = new _Connection["default"](this);
    this.connectionMonitor = new _ConnectionMonitor["default"](this);
  }
  return _createClass(Consumer, [{
    key: "send",
    value: function send(data) {
      return this.connection.send(data);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        url: this.url,
        subscriptions: this.subscriptions,
        connection: this.connection,
        connectionMonitor: this.connectionMonitor
      };
    }
  }]);
}();
var _default = exports["default"] = Consumer;