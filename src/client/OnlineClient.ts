import * as io from "socket.io-client";
import * as ioProxy from "socket.io-proxy";

import { LegacyEvents, Messages } from "@socialgorithm/model";
import { EventName } from "@socialgorithm/model/dist/Events";
import { IOptions } from "../cli/options";
import OnlinePlayer from "../player/Online";
import Client from "./Client";

/**
 * Online Player mode
 * It will connect to the server and send all player commands over the socket
 */
export default class OnlineClient extends Client {
    protected playerB: OnlinePlayer;

    /**
     * Main socket for communication with the tournament server
     */
    private tournamentServerSocket: SocketIOClient.Socket;

    /**
     * Support handing off to a game server
     */
    private gameServerSocket: SocketIOClient.Socket;

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

            this.tournamentServerSocket = this.connect(host, socketOptions);

            this.tournamentServerSocket.on("error", (data: any) => {
                console.error("Error in socket", data);
            });

            this.tournamentServerSocket.on("connect", () => {
                console.log(`Connected! Joining Lobby "${options.lobby}"...`);
                this.tournamentServerSocket.emit(LegacyEvents.EVENTS.LOBBY_JOIN, {
                    token: options.lobby,
                });
            });

            this.tournamentServerSocket.on("lobby joined", () => {
                console.log("Lobby Joined! Waiting for match...");
            });

            this.tournamentServerSocket.on("exception", (data: any) => {
                console.error(data.error);
                process.exit(-1);
            });

            this.tournamentServerSocket.on(LegacyEvents.EVENTS.LOBBY_EXCEPTION, (data: any) => {
                console.error(data.error);
                process.exit(-1);
            });

            this.tournamentServerSocket.on(EventName.GameServerHandoff, (handoffMessage: Messages.GameServerHandoffMessage) => {
                // Initiate a handoff to the game server
                const gameServerSocketOptions = {
                    query: {
                        token: handoffMessage.token,
                    },
                };

                console.log(`Initiating handoff to Game Server ${handoffMessage.gameServerAddress}, token = ${handoffMessage.token}`);

                if (this.gameServerSocket && this.gameServerSocket.connected) {
                    this.gameServerSocket.disconnect();
                }

                this.gameServerSocket = this.connect(handoffMessage.gameServerAddress, gameServerSocketOptions);

                this.gameServerSocket.on("error", (data: any) => {
                    console.error("Error in game server socket", data);
                });

                this.gameServerSocket.on("connect", () => {
                    console.log(`Connected to Game Server (token: ${handoffMessage.token}), waiting for match to begin`);
                });

                this.gameServerSocket.on("disconnect", () => {
                    console.log(`Disconnected from game server (token: ${handoffMessage.token})`);
                });

                if (!this.playerB) {
                    this.playerB = new OnlinePlayer(this.gameServerSocket, this.onPlayerBData.bind(this));
                } else {
                    this.playerB.setSocket(this.gameServerSocket);
                }
            });

            this.tournamentServerSocket.on("disconnect", () => {
                console.log("Connection to Tournament Server lost!");
            });
        } catch (e) {
            console.error("uabc error:", e);
            process.exit(-1);
        }
    }

    public onPlayerAData(payload: string) {
        this.log("A", payload);
        const message: Messages.PlayerToGameMessage = {
            payload,
        };
        if (this.gameServerSocket) {
            this.gameServerSocket.emit(EventName.Game__Player, message);
        }
    }

    public onPlayerBData(data: string) {
        this.log("B", data);
        this.playerA.onDataFromOtherPlayers(data);
    }

    private connect(host: string, socketOptions?: any): SocketIOClient.Socket {
        if (this.options.proxy || process.env.http_proxy) {
            if (this.options.proxy) {
                ioProxy.init(this.options.proxy);
            }
            return ioProxy.connect(host, socketOptions);
        } else {
            return io.connect(host, socketOptions);
        }
    }
}
