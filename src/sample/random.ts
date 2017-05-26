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
    this.game = this.game.addOpponentMove(board, move);
  }

  public addMove(board: Coord, move: Coord){
    this.game = this.game.addMyMove(board, move);
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

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if(!this.game.board[x][y].isFinished()){
          return [x, y];
        }
      }
    }

    // Won't happen during normal game states
    // if this is reached it means that the game state has been
    // altered incorrectly
    throw new Error('Error: Unable to find available board');
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
    let valid = null;
    while(!valid){
      let move: Coord = [
        this.getRandomCoordinate(),
        this.getRandomCoordinate(),
      ];
      if(board.isValidMove(move)){
        valid = move;
      }
    }
    return valid;
  }
}