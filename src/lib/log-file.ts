import fs from 'fs';
import os from 'os';

/**
 * File logger module - it replaces the file if it already exists
 * @param file path to log file
 * @returns {Function} log function, takes the writer (identity), and the data to log
 */
export default (file: string): Function => {
  fs.writeFile(file, '', { flag: 'w' }, (err: any) => {
    if (err) throw err;
  });

  return function(writer: string, text: string): void {
    const time = (new Date()).toTimeString().substr(0,8);
    fs.appendFile(file, '[' + time + ' ' + writer + '] ' + text + os.EOL, (err: any) => {
      console.error('Error: Unable to write to log file', err);
    });
  }
};