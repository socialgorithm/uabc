import { ChildProcess } from "child_process";

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

        this.initGameServer();

        setTimeout(() => {
            options.files.forEach(file => {
                this.otherPlayers.push(
                    new ExecutablePlayer(file, this.onOtherPlayersData.bind(this)),
                );
            });

            console.log();
            console.log("Connecting to local game server...");
            console.log();

            this.initGameServerConnection();

            // Start a match and games, using all the local players
        }, 3000);
    }

    protected onLocalPlayerData(data: string): void {
        throw new Error("Method not implemented.");
    }

    protected onOtherPlayersData(data: string): void {
        throw new Error("Method not implemented.");
    }

    private initGameServer() {
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
        } catch (e) {
            console.error("uabc error:", e);
            process.exit(-1);
        }
    }

    private initGameServerConnection() {
        try {
            let host = this.options.host || "localhost:5433";
            if (host.substr(0, 4) !== "http") {
                host = "http://" + host;
            }
            const socketOptions = {
                query: "token=practice",
            };

            this.gameServerSocket = connect(host, this.options, socketOptions);

            this.gameServerSocket.on("error", (data: any) => {
                console.error("Error in socket", data);
            });

            this.gameServerSocket.on("connect", () => {
                console.log(`Connected! Initiating games...`);
                // TODO: Do something here
            });

            this.gameServerSocket.on("disconnect", () => {
                console.log(`Disconnected from game server`);
            });

            this.gameServerSocket.on("exception", (data: any) => {
                console.error(data.error);
                process.exit(-1);
            });
        } catch (e) {
            console.error("uabc error:", e);
            process.exit(-1);
        }
    }
}
