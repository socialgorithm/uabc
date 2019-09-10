import { ChildProcess } from "child_process";
import { EventName, Game, Match, MatchOptions, Messages  } from "@socialgorithm/model";

import { IOptions } from "../cli/options";
import connect from "../lib/connect";
import exec from "../lib/exec";
import { GAME_SERVER_BIN } from "../lib/practice";
import FileLogger from "../logger/FileLogger";
import ExecutablePlayer from "../player/Executable";
import Client from "./Client";

export default class PracticeClient extends Client {
    protected otherPlayers: ExecutablePlayer[];

    private gameServerProcess: ChildProcess;
    private gameServerSocket: SocketIOClient.Socket;
    private gameServerLogger: FileLogger;

    constructor(options: IOptions) {
        super(options);

        console.log(`Starting Practice Mode: ${options.practice}`);

        if (this.options.log) {
            this.gameServerLogger = new FileLogger("gameServer.log");
        }

        if (options.host) {
            this.initGameServerConnection();
        } else {
            this.initGameServer().then(() => {
                this.initGameServerConnection();
            });
        }
    }

    protected onLocalPlayerData(data: string): void {
        throw new Error("Method not implemented.");
    }

    protected onOtherPlayersData(data: string): void {
        throw new Error("Method not implemented.");
    }

    private initGameServer() {
        return new Promise((resolve, reject) => {
            try {
                const gameServerBin = GAME_SERVER_BIN[this.options.practice];

                if (!gameServerBin) {
                    throw new Error(`Unknown game "${this.options.practice}"`);
                }

                console.log("Running game server: ", gameServerBin);

                this.gameServerProcess = exec(gameServerBin);

                console.log("Started game server");

                this.gameServerProcess.on("close", (code: string) => {
                    console.log(`uabc> game server exited with code ${code}`);
                });

                // Temporary console logging for the game server

                this.gameServerProcess.stdout.on("data", (data: string) => {
                    console.log("gameServer>", data);
                });

                this.gameServerProcess.stderr.on("data", (data: string) => {
                    console.log("gameServer error>", data);
                });

                // if (this.options.log) {
                //     this.gameServerProcess.stdout.on("data", (data: string) => {
                //         this.gameServerLogger.log(data);
                //     });

                //     this.gameServerProcess.stderr.on("data", (data: string) => {
                //         this.gameServerLogger.log("error", data);
                //     });
                // }

                setTimeout(() => {
                    resolve();
                }, 3000);
            } catch (e) {
                console.error("uabc error:", e);
                process.exit(-1);
            }
        });
    }

    private initGameServerConnection() {
        try {
            this.options.files.forEach(file => {
                this.otherPlayers.push(
                    new ExecutablePlayer(file, this.onOtherPlayersData.bind(this)),
                );
            });

            console.log();
            console.log("Connecting to local game server...");
            console.log();

            let host = this.options.host || "localhost:5433";
            if (host.substr(0, 4) !== "http") {
                host = "http://" + host;
            }
            const socketOptions =  {
                econnection: true,
                timeout: 2000
            };

            this.gameServerSocket = connect(host, this.options, socketOptions);

            this.gameServerSocket.on("error", (data: any) => {
                console.error("Error in socket", data);
            });

            this.gameServerSocket.on("connect", () => {
                console.log(`Connected! Initiating games...`);

                this.initMatch();
            });

            this.gameServerSocket.on("disconnect", () => {
                console.log(`Disconnected from game server`);
            });

            this.gameServerSocket.on("exception", (data: any) => {
                console.error(data.error);
                process.exit(-1);
            });

            this.gameServerSocket.on(EventName.MatchCreated, this.onMatchCreated);
            this.gameServerSocket.on(EventName.GameEnded, this.onGameEnded);
            this.gameServerSocket.on(EventName.MatchEnded, this.onMatchEnded);
        } catch (e) {
            console.error("uabc error:", e);
            process.exit(-1);
        }
    }

    private initMatch() {
        const matchOptions: MatchOptions = {
            maxGames: this.options.games || 10,
            timeout: 1000,
            autoPlay: true,
        };

        const players = this.options.files.map((file, index) => `player${index}`);

        this.gameServerSocket.emit(EventName.CreateMatch, { players, options: matchOptions });
    }

    private onMatchCreated = (message: Messages.MatchCreatedMessage) => {
        // debug("Received match created message %O", message);
        // These tokens are recognised on/sent by the game server (e.g. stats updates), save them for later mapping
        console.log("player tokens", message.playerTokens);
    }

    private onGameEnded = (game: Game) => {
        // debug("Finished game, winner %s", game.winner);
        // Convert tokens to player names
        // game.players = game.players.map(token => this.convertPlayerTokenToPlayerName(token));
        // game.winner = this.convertPlayerTokenToPlayerName(game.winner);

        // this.match.games.push(game);
        // this.updateMatchStats();

        // this.pubSub.publishNamespaced(
        //     this.tournamentID,
        //     PubSubEvents.MatchUpdated,
        //     this.match,
        // );
        console.log("game ended, winner ", game.winner);
    }

    private onMatchEnded = (match: Match) => {
        // debug("Finished game, winner %s", game.winner);
        // Convert tokens to player names
        // game.players = game.players.map(token => this.convertPlayerTokenToPlayerName(token));
        // game.winner = this.convertPlayerTokenToPlayerName(game.winner);

        // this.match.games.push(game);
        // this.updateMatchStats();

        // this.pubSub.publishNamespaced(
        //     this.tournamentID,
        //     PubSubEvents.MatchUpdated,
        //     this.match,
        // );
        console.log("match ended, winner ", match.winner);

        this.gameServerSocket.disconnect();

        if (this.gameServerProcess) {
            this.gameServerProcess.kill();
        }
    }
}
