import { IOptions } from "../cli/options";
import OnlinePlayer from "../player/Online";
import Client from "./Client";
export default class OnlineClient extends Client {
    protected playerB: OnlinePlayer;
    private tournamentServerSocket;
    private gameServerSocket;
    constructor(options: IOptions);
    onPlayerAData(payload: string): void;
    onPlayerBData(data: string): void;
    private connect;
}
