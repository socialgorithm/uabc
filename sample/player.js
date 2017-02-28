const readline = require('readline');
// Random player implementation
const Random = require('./random');

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

  rl.on('line', function (input) {
    const parts = input.split(' ');
    const action = parts[0];

    let next, move, board;

    switch (action) {
      case 'init':
        player.init();
        break;
      case 'move':
        write(getMove(player));
        break;
      case 'opponent':
        console.error('opponent ' + parts[1]);
        console.error('next valid board: ', player.game.nextBoard);
        // the move will be in the format x,y;x,y
        // where the first pair are the board's coordinates
        // and the second one are the move's coordinates
        next = parts[1].split(';');
        board = next[0].split(',');
        move = next[1].split(',');
        player.addOpponentMove(board, move);
        write(getMove(player));
        break;
    }
  });
}

function getMove(player) {
  const coords = player.getMove();
  const move = coords.board[0] + ',' + coords.board[1] + ';' +
    coords.move[0] + ',' + coords.move[1];
  write(move);
}

function player() {
  input();
}

function write(output) {
  if (output) {
    console.log(output);
  }
}

player();