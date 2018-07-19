import {Coord, ME, OPPONENT, Coords} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import * as funcs from '../lib/funcs';
import Player from "./model/Player";
import {Options} from "../lib/input";
import Random from "../sample/random";

/**
 * Player that uses the built in random algorithm
 */
export default class RandomPlayer extends Player {

    private randomPlayer: Random;

    constructor(options: Options, sendMove: (move: string) => void) {
        super(options, sendMove);

        this.randomPlayer = new Random(OPPONENT, 3);
    }

    public addOpponentMove(move: string) {
        const coords = this.parseMove(move);
        if (!coords) {
            return;
        }
        this.randomPlayer.addOpponentMove(coords.board, coords.move);

        // Check if the game ended
        if (!this.randomPlayer.game.isFinished()) {
            const moveCoords = this.randomPlayer.getMove();
            this.randomPlayer.addMove(moveCoords.board, moveCoords.move);
            this.sendPlayerMove(this.stringifyMove(moveCoords));
        }
    }

    private stringifyMove(moveCoords: Coords): string {
        return moveCoords.board.join(',') + ';' + moveCoords.move.join(',');
    }

    private parseMove(data: string): Coords {
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
            return {
                board,
                move,
            };
        }
        console.error('Unknown command', data);
        return null;
    }

    // public checkEnding(): boolean {
    //     if (this.playerB.game.isFinished()) {
    //         const result = this.playerB.game.getResult();
    //         if (result === -1) {
    //             this.state.ties++;
    //         } else{
    //             this.state.wins[result]++;
    //         }
    //         // store timing
    //         const hrend = process.hrtime(this.gameStart);
    //         this.state.times.push(funcs.convertExecTime(hrend[1]));
    //         if (this.options.verbose) {
    //             console.log('-----------------------');
    //             console.log(`Game Ended (${funcs.convertExecTime(hrend[1])}ms)`);
    //             console.log(`Winner: ${result}`);
    //             console.log(this.playerB.game.prettyPrint());
    //             console.log('');
    //         }
    //         if (this.state.games < this.options.games) {
    //             this.startGame();
    //             return true;
    //         } else {
    //             this.state.printState();
    //             process.exit(0);
    //         }
    //     }
    //     return false;
    // }
}