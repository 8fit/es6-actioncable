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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /*
# Responsible for ensuring the cable connection is in good health by validating
  the heartbeat pings sent from the server, and attempting
# revival reconnections if things go astray. Internal class, not intended for
  direct user manipulation.
*/
var now = function now() {
  return new Date().getTime();
};
var secondsSince = function secondsSince(time) {
  return (now() - time) / 1000;
};
var clamp = function clamp(number, min, max) {
  return Math.max(min, Math.min(max, number));
};
var ConnectionMonitor = /*#__PURE__*/function () {
  function ConnectionMonitor(consumer) {
    _classCallCheck(this, ConnectionMonitor);
    this.pollInterval = {
      min: 3,
      max: 30
    };
    this.staleThreshold = 6;
    this.consumer = consumer;
    this.visibilityDidChange = this.visibilityDidChange.bind(this);
    this.start();
  }
  return _createClass(ConnectionMonitor, [{
    key: "connected",
    value: function connected() {
      this.reset();
      this.pingedAt = now();
      delete this.disconnectedAt;
      return _Logger["default"].log('ConnectionMonitor connected');
    }
  }, {
    key: "disconnected",
    value: function disconnected() {
      this.disconnectedAt = now();
      return _Logger["default"].log('ConnectionMonitor disconnected');
    }
  }, {
    key: "ping",
    value: function ping() {
      this.pingedAt = now();
      return this.pinedAt;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.reconnectAttempts = 0;
      return this.consumer.connection.isOpen();
    }
  }, {
    key: "start",
    value: function start() {
      this.reset();
      delete this.stoppedAt;
      this.startedAt = now();
      this.poll();
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', this.visibilityDidChange);
      }
      return _Logger["default"].log("ConnectionMonitor started, pollInterval is ".concat(this.getInterval(), "ms"));
    }
  }, {
    key: "stop",
    value: function stop() {
      this.stoppedAt = now();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', this.visibilityDidChange);
      }
      return _Logger["default"].log('ConnectionMonitor stopped');
    }
  }, {
    key: "poll",
    value: function poll() {
      return setTimeout(function (that) {
        return function () {
          if (!that.stoppedAt) {
            that.reconnectIfStale();
            return that.poll();
          }
          return true;
        };
      }(this), this.getInterval());
    }
  }, {
    key: "getInterval",
    value: function getInterval() {
      var ref = this.pollInterval;
      var min = ref.min;
      var max = ref.max;
      var interval = 5 * Math.log(this.reconnectAttempts + 1);
      return clamp(interval, min, max) * 1000;
    }
  }, {
    key: "reconnectIfStale",
    value: function reconnectIfStale() {
      if (this.connectionIsStale()) {
        _Logger["default"].log("ConnectionMonitor detected stale connection, reconnectAttempts = ".concat(this.reconnectAttempts));
        this.reconnectAttempts += 1;
        if (this.disconnectedRecently()) {
          return _Logger["default"].log("ConnectionMonitor skipping reopen because recently disconnected at ".concat(this.disconnectedAt));
        }
        _Logger["default"].log('ConnectionMonitor reopening');
        return this.consumer.connection.reopen();
      }
      return true;
    }
  }, {
    key: "connectionIsStale",
    value: function connectionIsStale() {
      var pingedAt = this.pingedAt !== null ? this.pingedAt : this.startedAt;
      return pingedAt > this.stateThreshold;
    }
  }, {
    key: "disconnectedRecently",
    value: function disconnectedRecently() {
      return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.staleThreshold;
    }
  }, {
    key: "visibilityDidChange",
    value: function visibilityDidChange() {
      if (document.visibilityState === 'visible') {
        return setTimeout(function (that) {
          return function () {
            if (that.connectionIsStale() || !that.consumer.connection.isOpen()) {
              _Logger["default"].log("ConnectionMonitor reopening stale connection after visibilitychange to ".concat(document.visibilityState));
              return that.consumer.connection.reopen();
            }
            return true;
          };
        }(this), 200);
      }
      return true;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var interval = this.getInterval();
      var connectionIsStale = this.connectionIsStale();
      return {
        startedAt: this.startedAt,
        stoppedAt: this.stoppedAt,
        pingedAt: this.pingedAt,
        reconnectAttempts: this.reconnectAttempts,
        connectionIsStale: connectionIsStale,
        interval: interval
      };
    }
  }]);
}();
var _default = exports["default"] = ConnectionMonitor;