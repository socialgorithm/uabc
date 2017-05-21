"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var os_1 = require("os");
exports["default"] = function (file) {
    fs_1["default"].writeFile(file, '', { flag: 'w' }, function (err) {
        if (err)
            throw err;
    });
    return function (writer, text) {
        var time = (new Date()).toTimeString().substr(0, 8);
        fs_1["default"].appendFile(file, '[' + time + ' ' + writer + '] ' + text + os_1["default"].EOL, function (err) {
            console.error('Error: Unable to write to log file', err);
        });
    };
};
//# sourceMappingURL=log-file.js.map