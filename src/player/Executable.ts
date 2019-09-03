import { ChildProcess } from "child_process";

import exec from "../lib/exec";
import Player from "./Player";

/**
 * Player that runs from a local executable
 */
export default class ExecutablePlayer extends Player {
    private playerProcess: ChildProcess;

    constructor(file: string, onDataFromThisPlayer: (data: string) => void) {
        super(onDataFromThisPlayer);

        if (!file || file.length < 1) {
            console.error("uabc error: executable not specified");
            process.exit(-1);
        }

        this.playerProcess = exec(file);

        this.playerProcess.on("close", (code: string) => {
            console.log(`client> child process exited with code ${code}`);
        });

        this.playerProcess.stdout.on("data", (data: string) => {
            const lines = data.split("\n");
            const regex = /^(send:).*/;
            const output: string[] = [];
            const gameData: string[] = [];
            lines.forEach(eachLine => {
                const line = eachLine.trim();
                if (line.length < 1) {
                    return;
                }
                if (regex.test(line.replace(/\s/g, ""))) {
                    gameData.push(line.replace("send:", ""));
                } else {
                    output.push(line);
                }
            });
            // Send game commands
            gameData.forEach(line => {
                this.onDataFromThisPlayer(line);
            });
            // Forward output to console
            if (output.length > 0) {
                console.log(output.join("\n"));
            }
        });

        this.playerProcess.stderr.on("data", (message: string) => {
            console.log("----------- PLAYER ERROR ---------");
            console.log(message);
            console.log("----------------------------------");
        });
    }

    public onDataFromOtherPlayers(data: string) {
        this.playerProcess.stdin.write(data + "\n");
    }
}
