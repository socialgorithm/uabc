import Client from "./model/Client";
import { Options } from "./lib/input";
export default class OnlineClient extends Client {
    private socket;
    constructor(options: Options);
    onPlayerData(data: string): void;
    onDisconnect(): void;
}
