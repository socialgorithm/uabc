"use strict";
exports.__esModule = true;
var ConsoleLogger = (function () {
    function ConsoleLogger() {
    }
    ConsoleLogger.log = function (writer, data) {
        var time = (new Date()).toTimeString().substr(0, 8);
        console.log('[' + time + ' ' + writer + '] ' + data);
    };
    return ConsoleLogger;
}());
exports["default"] = ConsoleLogger;
;
//# sourceMappingURL=ConsoleLogger.js.map