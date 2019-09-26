import { EventName, LegacyEvents, Messages } from "@socialgorithm/model";

import { IOptions } from "../cli/options";
import connect from "../lib/connect";
import OnlinePlayer from "../player/Online";
import Client from "./Client";

/**
 * Online Player mode
 * It will connect to the server and send all player commands over the socket
 */
export default class OnlineClient extends Client {
    protected otherPlayers: OnlinePlayer[];

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
        console.log(`Local Player: ${this.options.files[0]}`);

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

            this.tournamentServerSocket = connect(host, options, socketOptions);

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

                this.gameServerSocket = connect(handoffMessage.gameServerAddress, options, gameServerSocketOptions);

                this.gameServerSocket.on("error", (data: any) => {
                    console.error("Error in game server socket", data);
                });

                this.gameServerSocket.on("connect", () => {
                    console.log(`Connected to Game Server (token: ${handoffMessage.token}), waiting for match to begin`);
                });

                this.gameServerSocket.on("disconnect", () => {
                    console.log(`Disconnected from game server (token: ${handoffMessage.token})`);
                });

                if (!this.otherPlayers[0]) {
                    this.otherPlayers[0] = new OnlinePlayer(this.gameServerSocket, this.onOtherPlayersData.bind(this));
                } else {
                    this.otherPlayers[0].setSocket(this.gameServerSocket);
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

    public onLocalPlayerData(payload: string) {
        this.log("A", payload);
        const message: Messages.PlayerToGameMessage = {
            payload,
        };
        if (this.gameServerSocket) {
            this.gameServerSocket.emit(EventName.Game__Player, message);
        }
    }

    public onOtherPlayersData(data: string) {
        this.log("B", data);
        this.otherPlayers[0].onDataFromOtherPlayers(data);
    }
}
