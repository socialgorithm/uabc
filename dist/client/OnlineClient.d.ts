import { Options } from "../cli/options";
import Client from "./Client";
export default class OnlineClient extends Client {
    private socket;
    constructor(options: Options);
    onPlayerAData(data: string): void;
    onPlayerBData(data: string): void;
}
