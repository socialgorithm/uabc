import Client from "./model/Client";
import { Options } from "./lib/input";
export default class PracticeClient extends Client {
    private state;
    private practicePlayer;
    private firstPlayer;
    private options;
    private size;
    private gameStart;
    constructor(options: Options);
    startGame(): void;
    onPlayerData(data: string): void;
    private opponentMove();
    checkEnding(): boolean;
    onDisconnect(): void;
}
