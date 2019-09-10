import { IOptions } from "../cli/options";
import OnlinePlayer from "../player/Online";
import Client from "./Client";
export default class OnlineClient extends Client {
    protected otherPlayers: OnlinePlayer[];
    private tournamentServerSocket;
    private gameServerSocket;
    constructor(options: IOptions);
    onLocalPlayerData(payload: string): void;
    onOtherPlayersData(data: string): void;
}
