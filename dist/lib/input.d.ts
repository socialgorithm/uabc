export interface Options {
    version: boolean;
    verbose: boolean;
    file: string;
    token: string;
    host: string;
    practice: boolean;
    log: string;
    help: boolean;
    games: number;
}
export default function parseInput(): Options;
