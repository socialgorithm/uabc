import { IOptions } from "../cli/options";
import ExecutablePlayer from "../player/Executable";
import Client from "./Client";
export default class PracticeClient extends Client {
    protected otherPlayers: ExecutablePlayer[];
    private playerSockets;
    private gameServerHost;
    private gameServerProcess;
    private gameServerSocket;
    private gameServerLogger;
    constructor(options: IOptions);
    protected onLocalPlayerData(data: string): void;
    protected onOtherPlayersData(data: string): void;
    private initGameServer;
    private initGameServerConnection;
    private initMatch;
    private onMatchCreated;
    private connectPlayer;
    private onGameEnded;
    private onMatchEnded;
}
