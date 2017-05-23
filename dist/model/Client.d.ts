/// <reference types="node" />
import { Options } from "../lib/input";
import { ChildProcess } from "child_process";
declare abstract class Client {
    private loggers;
    playerProcess: ChildProcess;
    constructor(options: Options);
    log(writer: string, data: string): void;
    abstract onPlayerData(data: string): void;
    abstract onDisconnect(): void;
}
export default Client;
