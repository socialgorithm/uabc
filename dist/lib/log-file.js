"use strict";
exports.__esModule = true;
var fs = require("fs");
var os = require("os");
exports["default"] = function (file) {
    fs.writeFile(file, '', { flag: 'w' }, function (err) {
        if (err)
            throw err;
    });
    return function (writer, text) {
        var time = (new Date()).toTimeString().substr(0, 8);
        fs.appendFile(file, '[' + time + ' ' + writer + '] ' + text + os.EOL, function (err) {
            console.error('Error: Unable to write to log file', err);
        });
    };
};
//# sourceMappingURL=log-file.js.map