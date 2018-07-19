import {Coord, OPPONENT, Coords} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import Player from "./model/Player";
import Random from "../sample/random";

/**
 * Player that uses the built in random algorithm
 */
export default class RandomPlayer extends Player {

    private randomPlayer: Random;

    constructor(sendData: (data: string) => void) {
        super(sendData);

        this.randomPlayer = new Random(OPPONENT, 3);
    }

    protected onReceiveData(data: string) {
        const parts = data.split(' ');
        const action = parts[0];

        let next,
            move: Coord,
            coords: Coords;

        switch (action) {
            case 'init':
                this.randomPlayer.init();
                break;
            case 'move':
                try {
                    coords = this.randomPlayer.getMove();
                    this.randomPlayer.addMove(coords.board, coords.move);
                    this.onPlayerData(this.stringifyMove(coords));
                } catch(e) {
                    console.error('Player Error: Failed to get a move', e);
                }
                break;
            case 'opponent':
                // the move will be in the format x,y;x,y
                // where the first pair are the board's coordinates
                // and the second one are the move's coordinates
                next = parts[1].split(';');
                const boardCoords = next[0].split(',').map((coord: string) => parseInt(coord, 10));
                const moveCoords = next[1].split(',').map((coord: string) => parseInt(coord, 10));
                this.randomPlayer.addOpponentMove(
                    [
                        boardCoords[0],
                        boardCoords[1]
                    ],
                    [
                        moveCoords[0],
                        moveCoords[1]
                    ]
                );
                if (!this.randomPlayer.game.isFinished()) {
                    coords = this.randomPlayer.getMove();
                    this.randomPlayer.addMove(coords.board, coords.move);
                    this.onPlayerData(this.stringifyMove(coords));
                }
                break;
        }
    }

    private stringifyMove(moveCoords: Coords): string {
        return moveCoords.board.join(',') + ';' + moveCoords.move.join(',');
    }
}