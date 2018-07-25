import {ME, OPPONENT} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import UTTT from "@socialgorithm/ultimate-ttt/dist/UTTT";

import {Options} from "../lib/input";
import Client from "./model/Client";
import ExecutablePlayer from "../player/Executable";
import RandomPlayer from "../player/Random";
import { parseMove, convertExecTime } from "../lib/funcs";

export default class PracticeClient extends Client {
    private currentGame: UTTT; // so we know whats up

    constructor(options: Options) {
        super(options);
        // This could be changed at some point
        this.size = 3;
        
        // Init Player B
        let playerBName;
        if (this.options.file.length > 1) {
            this.playerB = new ExecutablePlayer(options.file[1], this.onPlayerBData.bind(this));
            playerBName = options.file[1];
        } else {
            this.playerB = new RandomPlayer(this.onPlayerBData.bind(this));
            playerBName = '[Built-in Random Player]';
        }

        // Choose the first player at random
        this.firstPlayer = Math.round(Math.random());

        console.log(`Starting practice mode (${this.options.games} games)`);
        console.log(`Player A: ${this.options.file[0]}`);
        console.log(`Player B: ${playerBName}`);

        this.startGame();
    }

    private startGame() {
        this.currentGame = new UTTT();
        this.firstPlayer = 1 - this.firstPlayer;
        // initialize the players
        this.playerA.sendData('init');
        this.playerB.sendData('init');

        this.gameStart = process.hrtime();
        this.state.games++;

        if (this.firstPlayer === ME){
            // request move from player A
            this.playerA.sendData('move');
        } else {
            // request move from player B
            this.playerB.sendData('move');
        }
    }

    private nextGame() {
        const result = this.currentGame.getResult();
        if (result === -1) {
            this.state.ties++;
        } else{
            this.state.wins[result]++;
        }
        // store timing
        const hrend = process.hrtime(this.gameStart);
        this.state.times.push(convertExecTime(hrend[1]));
        if (this.options.verbose) {
            let winner = null;
            if (result === ME) {
                winner = 'Player A';
            } else if(result === OPPONENT) {
                winner = 'Player B';
            } else {
                winner = 'Tie';
            }
            console.log('-----------------------');
            console.log(`Game ${this.state.games} Ended (${convertExecTime(hrend[1])}ms)`);
            console.log(`Winner: ${winner} (${result})`);
            console.log(this.currentGame.prettyPrint());
            console.log('');
        }
        if (this.state.games < this.options.games) {
            this.startGame();
            return;
        }
        // Done!
        this.state.printState();
        process.exit(0);
    }

    protected onPlayerAData(data: string): void {
        const coords = parseMove(data);
        if (!coords) {
            console.log('error: received invalid move from player A');
        }
        this.currentGame = this.currentGame.addMyMove(coords.board, coords.move);
        this.log('A', data);
        if (this.currentGame.isFinished()) {
            this.nextGame();
            return;
        }
        this.playerB.sendData(`opponent ${data}`);
    }

    protected onPlayerBData(data: string): void {
        const coords = parseMove(data);
        if (!coords) {
            console.log('error: received invalid move from player B');
        }
        this.currentGame = this.currentGame.addOpponentMove(coords.board, coords.move);
        this.log('B', data);
        if (this.currentGame.isFinished()) {
            this.nextGame();
            return;
        }
        this.playerA.sendData(`opponent ${data}`);
    }
}