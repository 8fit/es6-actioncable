"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Logger = _interopRequireDefault(require("../Logger"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // # Encapsulate the cable connection held by the consumer.
// This is an internal class not intended for direct user manipulation.
var slice = [].slice;
var indexOf = [].indexOf;
var MessageTypes = {
  welcome: 'welcome',
  ping: 'ping',
  confirmation: 'confirm_subscription',
  rejection: 'reject_subscription'
};
var Connection = /*#__PURE__*/function () {
  function Connection(consumer) {
    _classCallCheck(this, Connection);
    this.reopenDelay = 500;
    this.consumer = consumer;
    var that = this;
    this.events = {
      message: function message(event) {
        var ref = JSON.parse(event.data);
        var identifier = ref.identifier;
        var message = ref.message;
        var type = ref.type;
        switch (type) {
          case MessageTypes.welcome:
            return that.consumer.connectionMonitor.connected();
          case MessageTypes.ping:
            return that.consumer.connectionMonitor.ping();
          case MessageTypes.confirmation:
            return that.consumer.subscriptions.notify(identifier, 'connected');
          case MessageTypes.rejection:
            return that.consumer.subscriptions.reject(identifier);
          default:
            if (identifier === MessageTypes.ping) {
              return that.consumer.connectionMonitor.ping();
            }
            return that.consumer.subscriptions.notify(identifier, 'received', message);
        }
      },
      open: function open() {
        _Logger["default"].log('WebSocket onopen event');
        that.disconnected = false;
        return that.consumer.subscriptions.reload();
      },
      close: function close() {
        _Logger["default"].log('WebSocket onclose event');
        return that.disconnect();
      },
      error: function error() {
        _Logger["default"].log('WebSocket onerror event');
        return that.disconnect();
      }
    };
    this.open();
  }
  return _createClass(Connection, [{
    key: "send",
    value: function send(data) {
      if (this.isOpen()) {
        this.webSocket.send(JSON.stringify(data));
        return true;
      }
      return false;
    }
  }, {
    key: "open",
    value: function open() {
      if (this.isAlive()) {
        _Logger["default"].log("Attemped to open WebSocket, but existing socket is ".concat(this.getState()));
        throw new Error('Existing connection must be closed before opening');
      } else {
        _Logger["default"].log("Opening WebSocket, current state is ".concat(this.getState()));
        if (this.webSocket != null) {
          this.uninstallEventHandlers();
        }
        // allow people to pass in their own method to create websockets
        if (this.consumer.options.createWebsocket) {
          this.webSocket = this.consumer.options.createWebsocket(this.consumer.options);
        } else {
          this.webSocket = new WebSocket(this.consumer.url);
        }
        this.installEventHandlers();
        return true;
      }
    }
  }, {
    key: "close",
    value: function close() {
      return this.webSocket != null ? this.webSocket.close() : true;
    }
  }, {
    key: "reopen",
    value: function reopen() {
      _Logger["default"].log("Reopening WebSocket, current state is ".concat(this.getState()));
      if (this.isAlive()) {
        try {
          return this.close();
        } catch (error) {
          return _Logger["default"].log('Failed to reopen WebSocket', error);
        } finally {
          _Logger["default"].log("Reopening WebSocket in ".concat(this.reopenDelay, "ms"));
          setTimeout(this.open.bind(this), this.reopenDelay);
        }
      } else {
        return this.open();
      }
    }
  }, {
    key: "isOpen",
    value: function isOpen() {
      return this.isState('open');
    }
  }, {
    key: "isAlive",
    value: function isAlive() {
      return this.webSocket != null && !this.isState('closing', 'closed');
    }
  }, {
    key: "isState",
    value: function isState() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var states = args.length <= 1 ? slice.call(args, 0) : [];
      var ref = this.getState();
      return indexOf.call(states, ref) >= 0;
    }
  }, {
    key: "getState",
    value: function getState() {
      var states = ['connecting', 'open', 'closing', 'closed'];
      if (this.webSocket) {
        return states[this.webSocket.readyState];
      }
      return true;
    }
  }, {
    key: "installEventHandlers",
    value: function installEventHandlers() {
      var eventName;
      var handler;
      /* eslint-disable */
      for (eventName in this.events) {
        handler = this.events[eventName].bind(this);
        this.webSocket["on".concat(eventName)] = handler;
      }
      /* eslint-enable */
    }
  }, {
    key: "uninstallEventHandlers",
    value: function uninstallEventHandlers() {
      var eventName;
      /* eslint-disable */
      for (eventName in this.events) {
        this.webSocket["on".concat(eventName)] = function () {};
      }
      /* eslint-enable */
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this.disconnected) {
        return;
      }
      this.disconnected = true;
      this.consumer.connectionMonitor.disconnected();
      this.consumer.subscriptions.notifyAll('disconnected');
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        state: this.getState()
      };
    }
  }]);
}();
var _default = exports["default"] = Connection;