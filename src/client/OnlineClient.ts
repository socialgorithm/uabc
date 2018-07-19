import * as io from 'socket.io-client';
import * as ioProxy from 'socket.io-proxy';

import {Options} from "../lib/input";
import Client from './model/Client';
import OnlinePlayer from '../player/Online';

/**
 * Online Player mode
 * It will connect to the server and send all player commands over the socket
 */
export default class OnlineClient extends Client {
    private socket: SocketIOClient.Socket;

    constructor(options: Options) {
        super(options);

        console.log();
        console.log('Waiting for server...');
        console.log();

        // Spawn the opponent (server)
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

            this.playerB = new OnlinePlayer(options, this.socket, this.onPlayerData);

            this.socket.on('error', (data: any) => {
                console.error('Error in socket', data);
            });

            this.socket.on('connect', () => {
                console.log('Connected! Joining Lobby...');
                this.socket.emit('lobby join', {
                    token: options.lobby,
                });
            });

            this.socket.on('lobby joined', () => {
                console.log('Lobby Joined!');
            });

            this.socket.on('exception', (data: any) => {
                console.error(data.error);
                process.exit(-1);
            });

            this.socket.on('disconnect', function() {
                console.log('Connection lost!');
            });
        } catch (e) {
            console.error('uabc error:', e);
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