import * as readline from 'readline';
// Random player implementation
import Random from './random';
import {Coord, Coords} from "@socialgorithm/ultimate-ttt/dist/model/constants";

/**
 * Simple implementation of a stdin/stdout piper for player implementations
 * In this case it's wired with the sample random algorithm.
 */

function input() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Load player's code
  let player = new Random(1);

  rl.on('line', (input: string) => {
    const parts = input.split(' ');
    const action = parts[0];

    let next,
        move: Coord,
        coords: Coords;

    switch (action) {
      case 'init':
        player.init();
        break;
      case 'move':
        try {
          coords = player.getMove();
          player.addMove(coords.board, coords.move);
          writeMove(coords);
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
        player.addOpponentMove(
          [
            boardCoords[0],
            boardCoords[1]
          ],
          [
            moveCoords[0],
            moveCoords[1]
          ]
        );
        if (!player.game.isFinished()) {
          coords = player.getMove();
          player.addMove(coords.board, coords.move);
          writeMove(coords);
        }
        break;
    }
  });
}

function writeMove(coords: { board: Array<number>, move: Array<number> }): void {
  const move = coords.board[0] + ',' + coords.board[1] + ';' +
    coords.move[0] + ',' + coords.move[1];
  write(move);
}

function player(): void {
  input();
}

function write(output?: string): void {
  if (output) {
    console.log(output);
  }
}

player();