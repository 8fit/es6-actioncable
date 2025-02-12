"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Subscription = _interopRequireDefault(require("./Subscription"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /*
# Collection class for creating (and internally managing) channel subscriptions.
The only method intended to be triggered by the user
# us Cable.Subscriptions#create, and it should be called through the consumer like so:
#
#   @App = {}
#   App.cable = Cable.createConsumer "ws://example.com/accounts/1"
#   App.appearance = App.cable.subscriptions.create "AppearanceChannel"
#
# For more details on how you'd configure an actual channel subscription, see Cable.Subscription.
*/
var slice = [].slice;
var Subscriptions = /*#__PURE__*/function () {
  function Subscriptions(consumer) {
    _classCallCheck(this, Subscriptions);
    this.consumer = consumer;
    this.subscriptions = [];
  }
  return _createClass(Subscriptions, [{
    key: "create",
    value: function create(channelName, mixin) {
      var channel = channelName;
      var params = _typeof(channel) === 'object' ? channel : {
        channel: channel
      };
      return new _Subscription["default"](this, params, mixin);
    }
  }, {
    key: "add",
    value: function add(subscription) {
      this.subscriptions.push(subscription);
      this.notify(subscription, 'initialized');
      return this.sendCommand(subscription, 'subscribe');
    }
  }, {
    key: "remove",
    value: function remove(subscription) {
      this.forget(subscription);
      if (!this.findAll(subscription.identifier).length) {
        return this.sendCommand(subscription, 'unsubscribe');
      }
      return true;
    }
  }, {
    key: "reject",
    value: function reject(identifier) {
      var i = 0;
      var len;
      var subscription;
      var ref = this.findAll(identifier);
      var results = [];
      for (len = ref.length; i < len; i += 1) {
        subscription = ref[i];
        this.forget(subscription);
        results.push(this.notify(subscription, 'rejected'));
      }
      return results;
    }
  }, {
    key: "forget",
    value: function forget(subscription) {
      var _this = this;
      var s;
      this.subscriptions = function () {
        var i;
        var len;
        var ref = _this.subscriptions;
        var results = [];
        for (i = 0, len = ref.length; i < len; i += 1) {
          s = ref[i];
          if (s !== subscription) {
            results.push(s);
          }
        }
        return results;
      }.call(this);
    }
  }, {
    key: "reload",
    value: function reload() {
      var i;
      var len;
      var subscription;
      var ref = this.subscriptions;
      var results = [];
      for (i = 0, len = ref.length; i < len; i += 1) {
        subscription = ref[i];
        results.push(this.sendCommand(subscription, 'subscribe'));
      }
      return results;
    }
  }, {
    key: "findAll",
    value: function findAll(identifier) {
      var i;
      var len;
      var s;
      var ref = this.subscriptions;
      var results = [];
      for (i = 0, len = ref.length; i < len; i += 1) {
        s = ref[i];
        if (s.identifier === identifier) {
          results.push(s);
        }
      }
      return results;
    }
  }, {
    key: "notifyAll",
    value: function notifyAll() {
      var i;
      var len;
      var subscription;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var callbackName = args[0];
      var formattedArgs = args.length <= 2 ? slice.call(args, 1) : [];
      var ref = this.subscriptions;
      var results = [];
      for (i = 0, len = ref.length; i < len; i += 1) {
        subscription = ref[i];
        results.push(this.notify.apply(this, _toConsumableArray([subscription, callbackName].concat(slice.call(formattedArgs)))));
      }
      return results;
    }
  }, {
    key: "notify",
    value: function notify() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      var subscription = args[0];
      var callbackName = args[1];
      var i;
      var len;
      var subscriptions;
      var formattedArgs = args.length <= 3 ? slice.call(args, 2) : [];
      if (typeof subscription === 'string') {
        subscriptions = this.findAll(subscription);
      } else {
        subscriptions = [subscription];
      }
      var results = [];
      for (i = 0, len = subscriptions.length; i < len; i += 1) {
        var _subscription;
        subscription = subscriptions[i];
        results.push(typeof subscription[callbackName] === 'function' ? (_subscription = subscription)[callbackName].apply(_subscription, _toConsumableArray(formattedArgs)) : 0);
      }
      return results;
    }
  }, {
    key: "sendCommand",
    value: function sendCommand(subscription, command) {
      var identifier = subscription.identifier;
      return this.consumer.send({
        command: command,
        identifier: identifier
      });
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var i;
      var len;
      var subscription;
      var ref = this.subscriptions;
      var results = [];
      for (i = 0, len = ref.length; i < len; i += 1) {
        subscription = ref[i];
        results.push(subscription.identifier);
      }
      return results;
    }
  }]);
}();
var _default = exports["default"] = Subscriptions;