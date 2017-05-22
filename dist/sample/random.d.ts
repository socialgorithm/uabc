import { Coord, Coords } from 'ultimate-ttt';
export default class Random {
    private size;
    private player;
    private oponent;
    private game;
    constructor(player: number, size?: number);
    init(): void;
    addOpponentMove(board: Coord, move: Coord): void;
    addMove(board: Coord, move: Coord): void;
    getMove(): Coords;
    private chooseBoard();
    private getRandomCoordinate();
    private findRandomPosition(board);
}
