import { IOptions } from "../cli/options";
import ConsoleLogger from "../logger/ConsoleLogger";
import FileLogger from "../logger/FileLogger";
import ExecutablePlayer from "../player/Executable";
import Player from "../player/Player";

export default abstract class Client {
    protected playerA: Player;
    protected playerB: Player;
    protected firstPlayer: number;
    protected options: IOptions;
    protected size: number;
    protected gameStart: [number, number];
    protected loggers: {
        console?: ConsoleLogger,
        file?: FileLogger,
    };

    constructor(options: IOptions) {
        this.options = options;

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

        this.playerA = new ExecutablePlayer(options.file, this.onPlayerAData.bind(this));
    }

    protected log(writer: string, message: string) {
        if (this.loggers.console) {
            this.loggers.console.log(writer, message);
        }
        if (this.loggers.file) {
            this.loggers.file.log(writer, message);
        }
    }

    protected abstract onPlayerAData(data: string): void;
    protected abstract onPlayerBData(data: string): void;
}
