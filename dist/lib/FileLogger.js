"use strict";
exports.__esModule = true;
var fs = require("fs");
var os = require("os");
var FileLogger = (function () {
    function FileLogger(file) {
        var _this = this;
        this.file = file;
        fs.writeFile(this.file, '', { flag: 'w' }, function (err) {
            if (err)
                throw err;
            console.log("Logging to file: " + _this.file);
        });
    }
    FileLogger.prototype.log = function (writer, text) {
        var time = (new Date()).toTimeString().substr(0, 8);
        fs.appendFile(this.file, '[' + time + ' ' + writer + '] ' + text + os.EOL, function (err) {
            console.error('Error: Unable to write to log file', err);
        });
    };
    return FileLogger;
}());
exports["default"] = FileLogger;
//# sourceMappingURL=FileLogger.js.map