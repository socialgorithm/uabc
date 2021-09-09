"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Logger_1 = require("./Logger");
var ConsoleLogger = (function (_super) {
    __extends(ConsoleLogger, _super);
    function ConsoleLogger() {
        var _this = _super.call(this) || this;
        console.log("Verbose mode");
        return _this;
    }
    ConsoleLogger.prototype.log = function (writer, data) {
        var time = (new Date()).toTimeString().substr(0, 8);
        console.log("[" + time + " " + writer + " " + data + "]");
    };
    return ConsoleLogger;
}(Logger_1["default"]));
exports["default"] = ConsoleLogger;
//# sourceMappingURL=ConsoleLogger.js.map