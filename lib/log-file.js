const fs = require('fs');
const util = require('util');
const os = require("os");

/**
 * File logger module - it replaces the file if it already exists
 * @param file path to log file
 * @returns {Function} log function, takes the writer (identity), and the data to log
 */
module.exports = function(file) {
  fs.writeFile(file, '', { flag: 'w' }, function (err) {
    if (err) throw err;
  });

  return function(writer, text) {
    const time = (new Date()).toTimeString().substr(0,8);
    fs.appendFile(file, '[' + time + ' ' + writer + '] ' + text + os.EOL, function (err) {
    });
  }
};