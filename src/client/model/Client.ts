import ConsoleLogger from "../../logger/ConsoleLogger";
import FileLogger from "../../logger/FileLogger";
import {Options} from "../../lib/input";
import Player from '../../player/model/Player';
import State from '../../model/State';
import ExecutablePlayer from '../../player/Executable';

export default abstract class Client {
    protected playerA: Player;
    protected playerB: Player;
    protected state: State;
    protected firstPlayer: number;
    protected options: Options;
    protected size: number;
    protected gameStart: [number, number];
    protected loggers: {
        console?: ConsoleLogger,
        file?: FileLogger,
    };

    constructor(options: Options) {
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

        // Player A is always the executable file at 0
        this.playerA = new ExecutablePlayer(options.file[0], this.onPlayerAData.bind(this));

        // Hold the state for the local games
        this.state = new State();
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