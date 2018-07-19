import ConsoleLogger from "../../lib/ConsoleLogger";
import FileLogger from "../../lib/FileLogger";
import { Options } from "../../lib/input";

/**
 * A Player represents one player of the two required to play a game.
 * 
 * It exposes the necessary methods to interact with it (sendData, receiveData)
 */
export default abstract class Player {
    private loggers: {
        console?: ConsoleLogger,
        file?: FileLogger,
    };

    constructor(options: Options, private _sendData: (data: string) => void) {
        this.loggers = {};

        if (options.verbose) {
            this.loggers.console = new ConsoleLogger();
        }

        if (options.log) {
            let logName;
            if (options.log.length > 0) {
                logName = options.log;
            }
            this.loggers.file = new FileLogger(logName);
        }
    }

    public sendData(data: string): void {
        this.log('server', data);
        this._sendData(data);
    }

    public log(writer: string, data: string) {
        if (this.loggers.console) {
            this.loggers.console.log(writer, data);
        }
        if (this.loggers.file) {
            this.loggers.file.log(writer, data);
        }
    }

    public abstract onReceiveData(data: string): void;
}