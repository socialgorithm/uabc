import Player from "./model/Player";

/**
 * Online Player mode
 * It will connect to the server and send all player commands over the socket
 */
export default class OnlinePlayer extends Player {
    constructor(private socket: SocketIOClient.Socket, sendData: (data: string) => void) {
        super(sendData);

        this.socket.on('game', this.onServerData);
    }

    private onServerData = (data: string) => {
        if (data && data.length > 0) {
            const parts = data.split(' ');
            if (parts[0] === 'end') {
                console.log('Games ended! You ' + parts[1]);
            } else {
                this.onPlayerData(data);
            }
        }
    };

    protected onReceiveData(data: string) {
        this.socket.emit('game', data);
    }
}