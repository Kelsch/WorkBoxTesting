"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sum = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sum = exports.sum = function sum(a, b) {
  return new _promise2.default(function (resolve) {
    return resolve(a + b);
  });
};