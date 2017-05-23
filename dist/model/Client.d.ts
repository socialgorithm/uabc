import { Options } from "../lib/input";
declare abstract class Client {
    private loggers;
    private playerProcess;
    constructor(options: Options);
    sendData(data: string): void;
    log(writer: string, data: string): void;
    abstract onPlayerData(data: string): void;
    abstract onDisconnect(): void;
}
export default Client;
