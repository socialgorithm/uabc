/**
 * Console logger module
 * @param writer identity of current logger
 * @param data log content
 */
module.exports = function (writer, data) {
  const time = (new Date()).toTimeString().substr(0,8);
  console.log('[' + time + ' ' + writer + '] ' + data);
};