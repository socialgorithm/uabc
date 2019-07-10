import { Coords } from "@socialgorithm/ultimate-ttt/dist/model/constants";
export declare const round: (time: number) => number;
export declare const convertExecTime: (nanosecs: number) => number;
export declare const getPercentage: (num: number, total: number) => string;
export declare const parseMove: (data: string) => Coords;
