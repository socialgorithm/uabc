import UTTT from '@socialgorithm/ultimate-ttt';
import { Coord, Coords } from "@socialgorithm/ultimate-ttt/dist/model/constants";
export default class Random {
    private size;
    private player;
    private oponent;
    game: UTTT;
    constructor(player: number, size?: number);
    init(): void;
    addOpponentMove(board: Coord, move: Coord): void;
    addMove(board: Coord, move: Coord): void;
    getMove(): Coords;
    private chooseBoard();
    private getRandomCoordinate();
    private findRandomPosition(board);
}
