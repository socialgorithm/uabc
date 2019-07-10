import { IOptions } from "../cli/options";
import Client from "./Client";
export default class OnlineClient extends Client {
    private socket;
    constructor(options: IOptions);
    onPlayerAData(data: string): void;
    onPlayerBData(data: string): void;
}
