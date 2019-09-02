import * as fs from 'fs';
import * as path from 'path';
import * as which from 'which';

// NPM Directories
let GLOBAL_NPM_BIN: string;
let GLOBAL_NPM_PATH: string;

const throwNotFoundError = () => {
    const err: any = new Error("Cannot find module 'npm'")
    err.code = 'MODULE_NOT_FOUND'
    throw err;
};

try {
    GLOBAL_NPM_BIN = process.env.GLOBAL_NPM_BIN || fs.realpathSync(which.sync('npm'));
} catch (e) {
    console.error(e);
    throwNotFoundError();
}

GLOBAL_NPM_PATH = process.env.GLOBAL_NPM_PATH || path.join(
    GLOBAL_NPM_BIN,
    process.platform === 'win32' ? '../node_modules/npm' : '../..'
);

export default (npmPackage: string, args?: string) => {
    try {
        const npx = require(GLOBAL_NPM_PATH + '/node_modules/libnpx');
        const NPM_PATH = path.join(GLOBAL_NPM_PATH, 'bin', 'npm-cli.js')
        const parsedArgs = npx.parseArgs(['npx', '', npmPackage, args], NPM_PATH);

        return npx(parsedArgs);
    } catch (e) {
        console.error(e);
        if (e.code !== 'MODULE_NOT_FOUND') {
            throw e;
        }
    }
    throwNotFoundError();
};
