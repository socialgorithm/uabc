import { IOptions } from "../cli/options";
import ConsoleLogger from "../logger/ConsoleLogger";
import FileLogger from "../logger/FileLogger";
import Player from "../player/Player";
export default abstract class Client {
    protected localPlayer: Player;
    protected otherPlayers: Player[];
    protected options: IOptions;
    protected loggers: {
        console?: ConsoleLogger;
        file?: FileLogger;
    };
    constructor(options: IOptions);
    protected log(writer: string, message: string): void;
    protected abstract onLocalPlayerData(data: string): void;
    protected abstract onOtherPlayersData(data: string): void;
}
