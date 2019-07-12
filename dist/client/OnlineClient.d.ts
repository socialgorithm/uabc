import { IOptions } from "../cli/options";
import OnlinePlayer from "../player/Online";
import Client from "./Client";
export default class OnlineClient extends Client {
    protected playerB: OnlinePlayer;
    private socket;
    private gameServerSocket;
    constructor(options: IOptions);
    onPlayerAData(data: string): void;
    onPlayerBData(data: string): void;
    private connect;
}
