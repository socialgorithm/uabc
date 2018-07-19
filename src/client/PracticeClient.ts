import {Coord, ME, OPPONENT} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import {Options} from "../lib/input";
import Client from "./model/Client";
import ExecutablePlayer from "../player/Executable";
import RandomPlayer from "../player/Random";
import State from "../model/State";
import UTTT from "../../node_modules/@socialgorithm/ultimate-ttt/dist/UTTT";
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
            this.playerB = new ExecutablePlayer(options.file[1], options, this.onPlayerBData.bind(this));
            playerBName = options.file[1];
        } else {
            this.playerB = new RandomPlayer(options, this.onPlayerBData.bind(this));
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
        this.playerA.onReceiveData('init');
        this.playerB.onReceiveData('init');

        this.gameStart = process.hrtime();
        this.state.games++;

        if (this.firstPlayer === ME){
            // request move from player A
            this.playerA.onReceiveData('move');
        } else {
            // request move from player B
            this.playerB.onReceiveData('move');
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
            console.log('-----------------------');
            console.log(`Game Ended (${convertExecTime(hrend[1])}ms)`);
            console.log(`Winner: ${result}`);
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
        if (this.currentGame.isFinished()) {
            this.nextGame();
            return;
        }
        this.playerB.onReceiveData(`opponent ${data}`);
    }

    protected onPlayerBData(data: string): void {
        const coords = parseMove(data);
        if (!coords) {
            console.log('error: received invalid move from player B');
        }
        this.currentGame = this.currentGame.addOpponentMove(coords.board, coords.move);
        if (this.currentGame.isFinished()) {
            this.nextGame();
            return;
        }
        this.playerA.onReceiveData(`opponent ${data}`);
    }

    // /**
    //  * Received a move from player A
    //  * @param data
    //  */
    // public onPlayerData(data: string): void {
    //     const parts = data.split(';');
    //     const boardStr = parts[0].split(',');
    //     if (parts.length > 1) {
    //         const moveStr = parts[1].split(',');
    //         const board: Coord = [
    //             parseInt(boardStr[0], 10),
    //             parseInt(boardStr[1], 10)
    //         ];
    //         const move: Coord = [
    //             parseInt(moveStr[0], 10),
    //             parseInt(moveStr[1], 10)
    //         ];
    //         // for the practice player, we are the opponent
    //         //this.playerB.addOpponentMove(board, move);
    //         if (!this.checkEnding()){
    //             this.playerBMove();
    //         }
    //     } else {
    //         console.error('Unknown command', data);
    //     }
    // }

    // /**
    //  * Get a move from player B
    //  */
    // private playerBMove() {
    //     //const moveCoords = this.playerB.getMove();
    //     // store its move
    //     //this.playerB.addMove(moveCoords.board, moveCoords.move);
    //     // then send it to our client
    //     // this.sendData(
    //     //     'opponent ' + moveCoords.board.join(',') + ';' + moveCoords.move.join(',')
    //     // );
    //     this.checkEnding();
    // }
}