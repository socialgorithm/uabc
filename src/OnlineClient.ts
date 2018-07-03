import * as io from 'socket.io-client';
import * as ioProxy from 'socket.io-proxy';

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
            const socketOptions = {
                query: "token="+options.token,
            };

            if (options.proxy || process.env.http_proxy) {
                if (options.proxy) {
                    ioProxy.init(options.proxy);
                }
                this.socket = ioProxy.connect(host, socketOptions);
            } else {
                this.socket = io.connect(host, socketOptions);
            }

            this.socket.on('error', (data: any) => {
                console.error('Error in socket', data);
            });

            this.socket.on('connect', () => {
                console.log('Connected!');
            });

            this.socket.on('game', (data: any) => {
                if (data.action && data.action.length > 0) {
                    const parts = data.action.split(' ');
                    if (parts[0] === 'end') {
                        console.log('Games ended! You ' + parts[1]);
                    } else {
                        this.sendData(data.action);
                    }
                }
            });

            this.socket.on('disconnect', function() {
                console.log('Connection lost!');
            });
        } catch (e) {
            console.error('Error in UABC', e);
            process.exit(-1);
        }
    }

    public onPlayerData(data: string) {
        this.socket.emit('game', data);
    }

    public onDisconnect() {
        this.socket.disconnect();
    }
}