"use strict";
exports.__esModule = true;
var cp = require("child_process");
exports["default"] = (function (cmd) {
    var options = cmd.split(' ');
    var exec = options[0];
    options.shift();
    var childProcess = cp.spawn(exec, options);
    childProcess.stdout.setEncoding('utf8');
    childProcess.stderr.on('data', function (data) {
        console.log("Error: " + data);
    });
    return childProcess;
});
//# sourceMappingURL=exec.js.map