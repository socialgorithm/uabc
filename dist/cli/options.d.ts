export interface IOptions {
    files?: string[];
    token?: string;
    lobby?: string;
    host?: string;
    proxy?: string;
    log?: string;
    help?: boolean;
    verbose?: boolean;
    version?: boolean;
    practice?: string;
    games?: number;
}
export default function parseInput(): IOptions;
