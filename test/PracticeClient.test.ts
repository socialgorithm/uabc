import { expect } from 'chai';
import PracticeClient from '../src/PracticeClient';
import {DEFAULT_OPTIONS} from "../src/lib/input";

describe('PracticeClient', () => {

    const options = DEFAULT_OPTIONS;
    options.practice = true;

    let subject: PracticeClient;

    beforeEach(() => {
        subject = new PracticeClient(options);
    });

    describe('#playerTokens()', () => {

    });

});