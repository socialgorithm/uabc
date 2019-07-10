export interface Options {
    file?: string;
    token?: string;
    lobby?: string;
    host?: string;
    proxy?: string;
    log?: string;
    help?: boolean;
    verbose?: boolean;
    version?: boolean;
}
export default function parseInput(): Options;
