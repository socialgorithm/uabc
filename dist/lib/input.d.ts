export interface Options {
    version: boolean;
    verbose: boolean;
    file: string;
    token: string;
    host: string;
    practice: boolean;
    log: string;
    help: boolean;
}
export default function parseInput(): Options;
