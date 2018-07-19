import {Coord, ME, OPPONENT} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import * as funcs from '../lib/funcs';
import {Options} from "../lib/input";
import State from "../model/State";
import Random from "../sample/random";
import Client from "./model/Client";
import Player from "../players/model/Player";
import ExecutablePlayer from "../players/Executable";
import RandomPlayer from "../players/Random";

export default class PracticeClient extends Client {
    constructor(options: Options) {
        super(options);
        // This could be changed at some point
        this.size = 3;
        
        // Init Player B
        if (this.options.file.length > 1) {
            this.playerB = new ExecutablePlayer(options.file[1], options, this.onPlayerData);
        } else {
            this.playerB = new RandomPlayer(options, this.onPlayerData);
        }

        // Choose the first player at random
        this.firstPlayer = Math.round(Math.random());

        console.log(`Starting practice mode (${this.options.games} games)`);
        console.log(`Player A: ${this.options.file[0]}`);
        console.log(`Player B: ${this.options.file[1]}`);

        this.startGame();
    }

    public startGame() {
        this.firstPlayer = 1 - this.firstPlayer;
        // initialize the players
        //this.playerB = new Random(OPPONENT, this.size);
        // this.sendData('init');
        //
        this.gameStart = process.hrtime();
        this.state.games++;

        if (this.firstPlayer === ME){
            // request move from player A
            // this.sendData('move');
        } else {
            // request move from player B
            this.playerBMove();
        }
    }

    /**
     * Received a move from player A
     * @param data
     */
    public onPlayerData(data: string): void {
        const parts = data.split(';');
        const boardStr = parts[0].split(',');
        if (parts.length > 1) {
            const moveStr = parts[1].split(',');
            const board: Coord = [
                parseInt(boardStr[0], 10),
                parseInt(boardStr[1], 10)
            ];
            const move: Coord = [
                parseInt(moveStr[0], 10),
                parseInt(moveStr[1], 10)
            ];
            // for the practice player, we are the opponent
            //this.playerB.addOpponentMove(board, move);
            if (!this.checkEnding()){
                this.playerBMove();
            }
        } else {
            console.error('Unknown command', data);
        }
    }

    /**
     * Get a move from player B
     */
    private playerBMove() {
        //const moveCoords = this.playerB.getMove();
        // store its move
        //this.playerB.addMove(moveCoords.board, moveCoords.move);
        // then send it to our client
        // this.sendData(
        //     'opponent ' + moveCoords.board.join(',') + ';' + moveCoords.move.join(',')
        // );
        this.checkEnding();
    }

    public checkEnding(): boolean {
        // if (this.playerB.game.isFinished()) {
        //     const result = this.playerB.game.getResult();
        //     if (result === -1) {
        //         this.state.ties++;
        //     } else{
        //         this.state.wins[result]++;
        //     }
        //     // store timing
        //     const hrend = process.hrtime(this.gameStart);
        //     this.state.times.push(funcs.convertExecTime(hrend[1]));
        //     if (this.options.verbose) {
        //         console.log('-----------------------');
        //         console.log(`Game Ended (${funcs.convertExecTime(hrend[1])}ms)`);
        //         console.log(`Winner: ${result}`);
        //         console.log(this.playerB.game.prettyPrint());
        //         console.log('');
        //     }
        //     if (this.state.games < this.options.games) {
        //         this.startGame();
        //         return true;
        //     } else {
        //         this.state.printState();
        //         process.exit(0);
        //     }
        // }
        return false;
    }

    public onDisconnect(): void {
        console.error('Error: Player process exited');
    }
}