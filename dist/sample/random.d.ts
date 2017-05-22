export default class Random {
    private size;
    private player;
    private oponent;
    private game;
    constructor(player: number, size?: number);
    init(): void;
    addOpponentMove(board: Array<number>, move: Array<number>): void;
    addMove(board: Array<number>, move: Array<number>): void;
    getMove(): {
        board: number[];
        move: number[];
    };
    private chooseBoard();
    private getRandomCoordinate();
    private findRandomPosition(board);
}
