import * as fs from 'fs';
import * as os from 'os';
import Logger from "../model/Logger";

/**
 * File logger module - it replaces the file if it already exists
 * @param file path to log file
 * @returns {Function} log function, takes the writer (identity), and the data to log
 */
export default class FileLogger extends Logger {
  private file: string;

  constructor(file: string) {
    super();
    this.file = file;

    fs.writeFile(this.file, '', { flag: 'w' }, (err: any) => {
      if (err) throw err;
      console.log(`Logging to file: ${this.file}`);
    });
  }

  public log(writer: string, text: string): void {
    const time = (new Date()).toTimeString().substr(0,8);
    fs.appendFile(this.file, '[' + time + ' ' + writer + '] ' + text + os.EOL, (err: any) => {
      console.error('Error: Unable to write to log file', err);
    });
  }
}