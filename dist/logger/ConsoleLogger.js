"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Logger_1 = require("./model/Logger");
var ConsoleLogger = (function (_super) {
    __extends(ConsoleLogger, _super);
    function ConsoleLogger() {
        var _this = _super.call(this) || this;
        console.log('Verbose mode');
        return _this;
    }
    ConsoleLogger.prototype.log = function (writer, data) {
        var time = (new Date()).toTimeString().substr(0, 8);
        console.log('[' + time + ' ' + writer + '] ' + data);
    };
    return ConsoleLogger;
}(Logger_1["default"]));
exports["default"] = ConsoleLogger;
;
