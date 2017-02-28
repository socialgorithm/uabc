const cp = require('child_process');

/**
 * Execute a file with a given executable
 * @param cmd string to execute
 * @returns {*}
 */
function executeProgram(cmd) {
  const options = cmd.split(' ');
  const exec = options[0];
  options.shift();

  const childProcess = cp.spawn(exec, options);
  childProcess.stdout.setEncoding('utf8');

  childProcess.stderr.on('data', (data) => {
    console.log(`Error: ${data}`);
  });

  return childProcess
}

module.exports = executeProgram;