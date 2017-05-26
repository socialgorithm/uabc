import UTTT from '@socialgorithm/ultimate-ttt';
import {Coord, Coords, ME, OPPONENT} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import SubBoard from "@socialgorithm/ultimate-ttt/dist/SubBoard";

/**
 * Random client implementation of the UTTT Game
 */

export default class Random {
  private size: number;
  private player: number;
  private oponent: number;
  public game: UTTT;

  constructor(player: number, size: number = 3){
    if(!player || player < ME || player > OPPONENT){
      throw new Error('Invalid player');
    }

    this.size = size;
    this.player = player;
    this.oponent = 1 - player;

    this.init();
  }

  /* ----- Required methods ----- */

  public init(){
    this.game = new UTTT(this.size);
  }

  public addOpponentMove(board: Coord, move: Coord){
    try {
      this.game = this.game.addOpponentMove(board, move);
    } catch (e) {
      console.error('Game probably already over', e);
      console.error(this.game.prettyPrint());
      console.error(this.game.stateBoard.prettyPrint());
    }
  }

  public addMove(board: Coord, move: Coord){
    try {
      this.game = this.game.addMyMove(board, move);
    } catch (e) {
      console.error('-------------------------------');
      console.error("\n"+'Game probably already over', e);
      console.error("\n"+this.game.prettyPrint());
      console.error("\n"+this.game.stateBoard.prettyPrint());
      console.error('-------------------------------');
    }
  }

  public getMove(): Coords {
    const boardCoords = this.chooseBoard();
    const board = this.game.board[boardCoords[0]][boardCoords[1]];
    const move = this.findRandomPosition(board);

    return {
      board: boardCoords,
      move: move
    };
  }

  /* ---- Non required methods ----- */

  /**
   * Choose a valid board to play in
   * @returns {[number,number]} Board identifier [row, col]
   */
  private chooseBoard(): Coord {
    let board = this.game.nextBoard || [0, 0];

    if(!this.game.board[board[0]][board[1]].isFinished()){
      return board;
    }

    const validBoards = this.game.getValidBoards();
    if (validBoards.length === 0) {
      // this case should never happen :)
      throw new Error('Error: There are no boards available to play');
    }

    return validBoards[
      Math.floor(Math.random() * validBoards.length)
    ];
  }

  /**
   * Get a random valid coordinate
   * @returns {number} Coordinate in the range [0, this.size - 1]
   */
  private getRandomCoordinate(): number {
    return Math.round(Math.random() * (this.size - 1));
  }

  /**
   * Get a random position to play in a board
   * @param board Board identifier [row, col]
   * @returns {[number,number]} Position coordinates [row, col]
   */
  private findRandomPosition(board: SubBoard): Coord {
    if (board.isFull() || board.isFinished()) {
      console.error('This board is full/finished');
      return;
    }
    const validMoves = board.getValidMoves();
    if (validMoves.length === 0) {
      // this case should never happen :)
      throw new Error('Error: There are no moves available on this board');
    }

    return validMoves[
      Math.floor(Math.random() * validMoves.length)
    ];
  }
}