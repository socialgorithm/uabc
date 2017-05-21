"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
exports["default"] = function (cmd) {
    var options = cmd.split(' ');
    var exec = options[0];
    options.shift();
    var childProcess = child_process_1["default"].spawn(exec, options);
    childProcess.stdout.setEncoding('utf8');
    childProcess.stderr.on('data', function (data) {
        console.log("Error: " + data);
    });
    return childProcess;
};
//# sourceMappingURL=exec.js.map