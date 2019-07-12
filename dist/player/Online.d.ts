/// <reference types="socket.io-client" />
import Player from "./Player";
export default class OnlinePlayer extends Player {
    private socket;
    constructor(socket: SocketIOClient.Socket, onPlayerData: (data: string) => void);
    setSocket(socket: SocketIOClient.Socket): void;
    protected onReceiveData(data: string): void;
    private onServerData;
}
