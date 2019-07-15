/// <reference types="socket.io-client" />
import Player from "./Player";
export default class OnlinePlayer extends Player {
    private socket;
    constructor(socket: SocketIOClient.Socket, onDataFromThisPlayer: (data: string) => void);
    setSocket(socket: SocketIOClient.Socket): void;
    onDataFromOtherPlayers(payload: string): void;
    private onServerData;
}
