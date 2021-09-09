import { Socket } from "socket.io-client";
import Player from "./Player";
export default class OnlinePlayer extends Player {
    private socket;
    constructor(socket: Socket, onDataFromThisPlayer: (data: string) => void);
    setSocket(socket: Socket): void;
    onDataFromOtherPlayers(payload: string): void;
    private onServerData;
}
