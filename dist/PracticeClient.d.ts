import Client from "./model/Client";
import { Options } from "./lib/input";
export default class PracticeClient extends Client {
    private state;
    private opponent;
    constructor(options: Options);
    onPlayerData(data: string): void;
    checkEnding(): boolean;
    onDisconnect(): void;
}
