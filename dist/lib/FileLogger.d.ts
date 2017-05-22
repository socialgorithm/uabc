export default class FileLogger {
    private file;
    constructor(file: string);
    log(writer: string, text: string): void;
}
