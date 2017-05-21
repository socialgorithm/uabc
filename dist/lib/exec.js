var cp = require('child_process');
function executeProgram(cmd) {
    var options = cmd.split(' ');
    var exec = options[0];
    options.shift();
    var childProcess = cp.spawn(exec, options);
    childProcess.stdout.setEncoding('utf8');
    childProcess.stderr.on('data', function (data) {
        console.log("Error: " + data);
    });
    return childProcess;
}
module.exports = executeProgram;
//# sourceMappingURL=exec.js.map