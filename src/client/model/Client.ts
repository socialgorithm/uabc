import * as os from 'os';

import ConsoleLogger from "../../lib/ConsoleLogger";
import FileLogger from "../../lib/FileLogger";
import {Options} from "../../lib/input";
import Player from '../../players/model/Player';
import State from '../../model/State';
import ExecutablePlayer from '../../players/Executable';

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
        this.playerA = new ExecutablePlayer(options.file[0], options, this.onPlayerData);

        // Hold the state for the local games
        this.state = new State();
    }

    // public sendData(data: string): void {
    //     this.log('server', data);
    //     // this.playerProcess.stdin.write(data + os.EOL);
    // }

    // public log(writer: string, data: string) {
    //     if (this.loggers.console) {
    //         this.loggers.console.log(writer, data);
    //     }
    //     if (this.loggers.file) {
    //         this.loggers.file.log(writer, data);
    //     }
    // }

    public abstract onPlayerData(data: string): void;

    // public abstract onDisconnect(): void;
}