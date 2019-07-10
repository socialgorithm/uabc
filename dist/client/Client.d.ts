import { Options } from "../cli/options";
import ConsoleLogger from "../logger/ConsoleLogger";
import FileLogger from "../logger/FileLogger";
import Player from "../player/Player";
import State from "./State";
export default abstract class Client {
    protected playerA: Player;
    protected playerB: Player;
    protected state: State;
    protected firstPlayer: number;
    protected options: Options;
    protected size: number;
    protected gameStart: [number, number];
    protected loggers: {
        console?: ConsoleLogger;
        file?: FileLogger;
    };
    constructor(options: Options);
    protected log(writer: string, message: string): void;
    protected abstract onPlayerAData(data: string): void;
    protected abstract onPlayerBData(data: string): void;
}
