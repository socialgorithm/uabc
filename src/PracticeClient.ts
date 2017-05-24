import Client from "./model/Client";
import {Options} from "./lib/input";
import State from "./lib/State";
import Random from "./sample/random";
import {Coord, OPPONENT} from "@socialgorithm/ultimate-ttt/dist/model/constants";

export default class PracticeClient extends Client {
    private state: State;
    private opponent: Random;

    constructor(options: Options) {
        super(options);

        // This could be changed at some point
        const size = 3;

        // Hold the state for the local games
        this.state = new State();
        this.opponent = new Random(OPPONENT, size);

        console.log('Starting practice mode');

        this.sendData('init');
        this.sendData('move');
    }

    public onPlayerData(data: string): void {
        const parts = data.split(';');
        const boardStr = parts[0].split(',');
        const moveStr = parts[1].split(',');
        const board: Coord = [
            parseInt(boardStr[0], 10),
            parseInt(boardStr[1], 10)
        ];
        const move: Coord = [
            parseInt(moveStr[0], 10),
            parseInt(moveStr[1], 10)
        ];
        this.opponent.addOpponentMove(board, move);
        if (this.checkEnding() ){
            return;
        }
        const opponentMove = this.opponent.getMove();
        this.opponent.addMove(opponentMove.board, opponentMove.move);
        if (this.checkEnding() ){
            return;
        }
        this.sendData(
            'opponent ' + opponentMove.board.join(',') + ';' + opponentMove.move.join(',')
        );
    }

    public checkEnding(): boolean {
        if (this.opponent.game.isFinished()) {
            console.log('someone has won!');
            console.log(this.opponent.game.prettyPrint());
            console.log(this.opponent.game.stateBoard.prettyPrint());
            return true;
        }
        return false;
    }

    public onDisconnect(): void {
        console.error('Error: Player process exited');
    }
}