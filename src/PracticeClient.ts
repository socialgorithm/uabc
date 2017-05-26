import {Coord, ME, OPPONENT} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import * as funcs from './lib/funcs';
import Client from "./model/Client";
import {Options} from "./lib/input";
import State from "./lib/State";
import Random from "./sample/random";

export default class PracticeClient extends Client {
    private state: State;
    private practicePlayer: Random;
    private firstPlayer: number;
    private options: Options;
    private size: number;
    private gameStart: [number, number];

    constructor(options: Options) {
        super(options);
        this.options = options;
        // This could be changed at some point
        this.size = 3;

        // Choose the first player at random
        this.firstPlayer = Math.round(Math.random());

        // Hold the state for the local games
        this.state = new State();

        console.log(`Starting practice mode (${this.options.games} games)`);

        this.startGame();
    }

    public startGame() {
        this.firstPlayer = 1 - this.firstPlayer;
        this.practicePlayer = new Random(OPPONENT, this.size);
        this.gameStart = process.hrtime();
        this.state.games++;

        console.log('New game, starting player ' + this.firstPlayer);

        this.sendData('init');
        if (this.firstPlayer === ME){
            this.sendData('move');
        } else {
            this.opponentMove();
        }
    }

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
            this.practicePlayer.addOpponentMove(board, move);
            if (this.checkEnding()){
                return;
            }
            this.opponentMove();
        } else {
            console.error('Unknown command', data);
        }
    }

    private opponentMove() {
        const opponentMove = this.practicePlayer.getMove();
        // we add the opponent move as his own
        this.practicePlayer.addMove(opponentMove.board, opponentMove.move);
        // then send it to our client
        this.sendData(
            'opponent ' + opponentMove.board.join(',') + ';' + opponentMove.move.join(',')
        );
        if (this.checkEnding()){
            process.exit(0);
        }
    }

    public checkEnding(): boolean {
        if (this.practicePlayer.game.isFinished()) {
            const result = this.practicePlayer.game.getResult();
            if (result === -1) {
                console.log('tie');
                this.state.ties++;
            } else{
                console.log('winner', result);
                this.state.wins[result]++;
            }
            // store timing
            const hrend = process.hrtime(this.gameStart);
            this.state.times.push(funcs.convertExecTime(hrend[1]));
            if (this.state.games < this.options.games) {
                this.startGame();
            } else {
                console.log(this.state.printState());
                return true;
            }
        }
        return false;
    }

    public onDisconnect(): void {
        console.error('Error: Player process exited');
    }
}