import { IOptions } from "../cli/options";
import ConsoleLogger from "../logger/ConsoleLogger";
import FileLogger from "../logger/FileLogger";
import Player from "../player/Player";
export default abstract class Client {
    protected playerA: Player;
    protected playerB: Player;
    protected firstPlayer: number;
    protected options: IOptions;
    protected size: number;
    protected gameStart: [number, number];
    protected loggers: {
        console?: ConsoleLogger;
        file?: FileLogger;
    };
    constructor(options: IOptions);
    protected log(writer: string, message: string): void;
    protected abstract onPlayerAData(data: string): void;
    protected abstract onPlayerBData(data: string): void;
}
