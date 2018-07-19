import * as os from 'os';
import { ChildProcess } from "child_process";
import { Coords } from '@socialgorithm/ultimate-ttt/dist/model/constants';

import Player from "./model/Player";
import {Options} from "../lib/input";
import exec from "../lib/exec";

/**
 * Player that runs from a local executable
 */
export default class ExecutablePlayer extends Player {
    private playerProcess: ChildProcess;

    constructor(file: string, options: Options, sendMove: (move: string) => void) {
        super(options, sendMove);

        if (!file || file.length < 1) {
            console.error('uabc error: executable not specified');
            process.exit(-1);
        }

        this.playerProcess = exec(file);

        this.playerProcess.on('close', (code: string) => {
            console.log(`client> child process exited with code ${code}`);
        });

        this.playerProcess.stdout.on('data', (data: string) => {
            const lines = data.split(os.EOL);
            const regex = /^\d,\d;\d,\d$/;
            const output: Array<string> = [];
            lines.forEach((eachLine) => {
                const line = eachLine.trim();
                if (line.length < 1) {
                    return;
                }
                if (regex.test(line.replace(/\s/g,''))) {
                    this.log('player', line);
                    this.sendPlayerMove(line);
                } else {
                    output.push(line);
                }
            });
            if (output.length > 0) {
                console.log('---------- PLAYER OUTPUT ---------');
                console.log(output.join('\n'));
                console.log('----------------------------------');
            }
        });

        this.playerProcess.stderr.on('data', (message: string) => {
            console.log('---------- PLAYER OUTPUT ---------');
            console.log(message);
            console.log('----------------------------------');
        });
    }

    public addOpponentMove(move: string) {
        this.playerProcess.stdin.write(move + os.EOL);
    }
}