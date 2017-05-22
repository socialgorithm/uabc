/**
 * Console logger module
 * @param writer identity of current logger
 * @param data log content
 */
export default class ConsoleLogger {
  public static log(writer: string, data: string): void {
    const time = (new Date()).toTimeString().substr(0,8);
    console.log('[' + time + ' ' + writer + '] ' + data);
  }
};