import Player from "./model/Player";
import {Options} from "../lib/input";

/**
 * Online Player mode
 * It will connect to the server and send all player commands over the socket
 */
export default class OnlinePlayer extends Player {
    constructor(options: Options, private socket: SocketIOClient.Socket, sendMove: (move: string) => void) {
        super(options, sendMove);

        this.socket.on('game', this.onServerData);
    }

    private onServerData = (data: any) => {
        if (data.action && data.action.length > 0) {
            const parts = data.action.split(' ');
            if (parts[0] === 'end') {
                console.log('Games ended! You ' + parts[1]);
            } else {
                this.sendPlayerMove(data.action);
            }
        }
    };

    public addOpponentMove(move: string) {
        this.socket.emit('game', move);
    }
}