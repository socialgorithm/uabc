import * as readline from 'readline';
// Random player implementation
import Random from './random';

/**
 * Random client implementation of the UTTT Game
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

    let next, move, board, coords;

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
          console.log('fail');
        }
        break;
      case 'opponent':
        // the move will be in the format x,y;x,y
        // where the first pair are the board's coordinates
        // and the second one are the move's coordinates
        next = parts[1].split(';');
        board = next[0].split(',').map((coord: string) => parseInt(coord, 10));
        move = next[1].split(',').map((coord: string) => parseInt(coord, 10));
        player.addOpponentMove(board, move);
        try {
          coords = player.getMove();
          player.addMove(coords.board, coords.move);
          writeMove(coords);
        } catch(e) {
          console.log('fail');
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