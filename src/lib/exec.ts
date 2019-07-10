import * as cp from "child_process";
import {ChildProcess} from "child_process";

/**
 * Execute a file with a given executable
 * @param cmd string to execute
 * @returns {*}
 */
export default (cmd: string): ChildProcess => {
  const options = cmd.split(" ");
  const exec = options[0];
  options.shift();

  const childProcess = cp.spawn(exec, options);
  childProcess.stdout.setEncoding("utf8");

  childProcess.stderr.on("data", (data: string) => {
    console.log(`Error: ${data}`);
  });

  return childProcess;
};
