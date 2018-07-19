import Player from "./model/Player";
import {Options} from "../lib/input";

/**
 * Online Player mode
 * It will connect to the server and send all player commands over the socket
 */
export default class OnlinePlayer extends Player {
    constructor(private socket: SocketIOClient.Socket, sendData: (data: string) => void) {
        super(sendData);

        this.socket.on('game', this.onServerData);
    }

    private onServerData = (data: any) => {
        if (data.action && data.action.length > 0) {
            const parts = data.action.split(' ');
            if (parts[0] === 'end') {
                console.log('Games ended! You ' + parts[1]);
            } else {
                this.onPlayerData(data.action);
            }
        }
    };

    protected onReceiveData(move: string) {
        this.socket.emit('game', move);
    }
}