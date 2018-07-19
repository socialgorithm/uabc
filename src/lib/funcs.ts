import { Coords, Coord } from "../../node_modules/@socialgorithm/ultimate-ttt/dist/model/constants";

/**
 * Round a number to the nearest integer and return an int
 * @param time Float number
 * @returns {number} Int
 */
export const round = (time: number): number => {
  return Math.round(time * 100) / 100;
};

/**
 * Convert execution time to milliseconds
 * @param nanosecs Execution time in nanoseconds
 * @returns {number} Exec time in ms
 */
export const convertExecTime = (nanosecs: number): number => {
  return round(nanosecs/1000000);
};

/**
 * Convert a float 0-1 to a percentage string 0-100%
 * @param num Partial number
 * @param total Total number
 * @returns {string} Percentage string
 */
export const getPercentage = (num: number, total: number): string => {
  if(total < 1){
    return '0%';
  }
  return Math.floor(num * 100 / total) + '%';
};

/**
 * Parse a string containing a valid board;move and return them
 * @param data
 */
export const parseMove = (data: string): Coords => {
  const parts = data.split(';');
  const boardStr = parts[0].split(',');
  if (parts.length > 1) {
      const moveStr = parts[1].split(',');
      const board: Coord = [
          parseInt(boardStr[0], 10),
          parseInt(boardStr[1], 10)
      ];
      const move: Coord = [
          parseInt(moveStr[0], 10),
          parseInt(moveStr[1], 10)
      ];
      return {
          board,
          move,
      };
  }
  console.error('Unknown command', data);
  return null;
}