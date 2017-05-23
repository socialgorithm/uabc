import * as io from 'socket.io-client';

import Client from "./model/Client";
import {Options} from "./lib/input";

/**
 * Online Client mode
 * It will connect to the server and send all player commands over the socket
 */
export default class OnlineClient extends Client {
    private socket: SocketIOClient.Socket;

    constructor(options: Options) {
        super(options);

        console.log();
        console.log('Waiting for server...');
        console.log();

        // Spawn the player
        try {
            let host = options.host || 'localhost:3141';
            if (host.substr(0,4) !== 'http') {
                host = 'http://' + host;
            }

            this.socket = io.connect(host, {
                query: {
                    token: options.token
                }
            });

            this.socket.on('error', (data: any) => {
                console.error('Error in socket', data);
            });

            this.socket.on('connect', () => {
                console.log('Connected!');
            });

            this.socket.on('game', (data: any) => {
                this.log('server', data.action);
                if (data.action && data.action.length > 0) {
                    const parts = data.action.split(' ');
                    if (parts[0] === 'end') {
                        console.log('Games ended! You ' + parts[1]);
                    } else {
                        this.playerProcess.stdin.write(data.action + "\n");
                    }
                }
            });

            this.socket.on('disconnect', function() {
                console.log('Connection lost!');
            });
        } catch (e) {
            console.error('Error running player', e);
        }
    }

    public onPlayerData(data: string) {
        this.socket.emit('game', data);
    }

    public onDisconnect() {
        this.socket.disconnect();
    }
}