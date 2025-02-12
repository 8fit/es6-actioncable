"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
# A new subscription is created through the Cable.Subscriptions instance available
  on the consumer.
# It provides a number of callbacks and a method for calling remote procedure calls
  on the corresponding
# Channel instance on the server side.
#
# An example demonstrates the basic functionality:
#
#   App.appearance = App.cable.subscriptions.create "AppearanceChannel",
#     connected: ->
#       # Called once the subscription has been successfully completed
#
#     appear: ->
#       @perform 'appear', appearing_on: @appearingOn()
#
#     away: ->
#       @perform 'away'
#
#     appearingOn: ->
#       $('main').data 'appearing-on'
#
# The methods #appear and #away forward their intent to the remote AppearanceChannel
  instance on the server
# by calling the `@perform` method with the first parameter being the action
  (which maps to AppearanceChannel#appear/away).
# The second parameter is a hash that'll get JSON encoded and made available on
  the server in the data parameter.
#
# This is how the server component would look:
#
#   class AppearanceChannel < ApplicationCable::Channel
#     def subscribed
#       current_user.appear
#     end
#
#     def unsubscribed
#       current_user.disappear
#     end
#
#     def appear(data)
#       current_user.appear on: data['appearing_on']
#     end
#
#     def away
#       current_user.away
#     end
#   end
#
# The "AppearanceChannel" name is automatically mapped between the client-side
  subscription creation and the server-side Ruby class name.
# The AppearanceChannel#appear/away public methods are exposed automatically to
  client-side invocation through the @perform method.
*/

var extend = function extend(object, properties) {
  var key;
  var value;
  if (properties != null) {
    /* eslint-disable */
    for (key in properties) {
      if ({}.hasOwnProperty.call(properties, key)) {
        value = properties[key];
        object[key] = value;
      }
    }
    /* eslint-enable */
  }
  return object;
};
var Subscription = /*#__PURE__*/function () {
  function Subscription(subscriptions, params, mixin) {
    _classCallCheck(this, Subscription);
    this.subscriptions = subscriptions;
    this.identifier = JSON.stringify(params || {});
    extend(this, mixin);
    this.consumer = this.subscriptions.consumer;
    this.subscriptions.add(this);
  }
  return _createClass(Subscription, [{
    key: "perform",
    value: function perform(action, data) {
      var formattedData = Object.assign({}, data);
      if (formattedData === null) {
        formattedData = {};
      }
      formattedData.action = action;
      return this.send(formattedData);
    }
  }, {
    key: "send",
    value: function send(data) {
      return this.consumer.send({
        command: 'message',
        identifier: this.identifier,
        data: JSON.stringify(data)
      });
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe() {
      return this.subscriptions.remove(this);
    }
  }]);
}();
var _default = exports["default"] = Subscription;