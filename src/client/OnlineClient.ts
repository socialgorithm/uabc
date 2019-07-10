import * as io from "socket.io-client";
import * as ioProxy from "socket.io-proxy";

import { IOptions } from "../cli/options";
import OnlinePlayer from "../player/Online";
import Client from "./Client";

/**
 * Online Player mode
 * It will connect to the server and send all player commands over the socket
 */
export default class OnlineClient extends Client {
    private socket: SocketIOClient.Socket;

    constructor(options: IOptions) {
        super(options);

        console.log(`Starting Online Mode`);
        console.log(`Player A: ${this.options.file}`);

        console.log();
        console.log("Waiting for server...");
        console.log();

        // Spawn the opponent (server)
        try {
            let host = options.host || "localhost:3141";
            if (host.substr(0, 4) !== "http") {
                host = "http://" + host;
            }
            const socketOptions = {
                query: "token=" + options.token,
            };

            if (options.proxy || process.env.http_proxy) {
                if (options.proxy) {
                    ioProxy.init(options.proxy);
                }
                this.socket = ioProxy.connect(host, socketOptions);
            } else {
                this.socket = io.connect(host, socketOptions);
            }

            this.playerB = new OnlinePlayer(this.socket, this.onPlayerBData.bind(this));

            this.socket.on("error", (data: any) => {
                console.error("Error in socket", data);
            });

            this.socket.on("connect", () => {
                console.log(`Connected! Joining Lobby "${options.lobby}"...`);
                this.socket.emit("lobby join", {
                    token: options.lobby,
                });
            });

            this.socket.on("lobby joined", () => {
                console.log("Lobby Joined! Waiting for tournament to begin...");
            });

            this.socket.on("exception", (data: any) => {
                console.error(data.error);
                process.exit(-1);
            });

            this.socket.on("lobby exception", (data: any) => {
                console.error(data.error);
                process.exit(-1);
            });

            this.socket.on("disconnect", () => {
                console.log("Connection lost!");
            });
        } catch (e) {
            console.error("uabc error:", e);
            process.exit(-1);
        }
    }

    public onPlayerAData(data: string) {
        this.log("A", data);
        this.socket.emit("game", data);
    }

    public onPlayerBData(data: string) {
        this.log("B", data);
        this.playerA.sendData(data);
    }
}
