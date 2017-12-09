/* eslint-env mocha */
import { expect, use } from 'chai';
import dirty from 'dirty-chai';
import R from 'ramda';
import { lCommandName } from '../../lenses';
import { isMakeCommand, selectMakePath, selectMakeTemplate, selectMakeContext } from '../make';

const state = {
    command: {
        name: 'make',
        args: {
            type: 'delta',
            name: 'testDelta'
        }
    }
};

use(dirty);

describe('selector#make', () => {
    it('isMakeCommand returns true when running make', () => {
        expect(isMakeCommand(state)).to.be.true();
    });

    it('isMakeCommand returns false when not running make', () => {
        expect(isMakeCommand(R.set(lCommandName, 'new', state))).to.be.false();
    });

    it('selectMakePath should get target path', () => {
        expect('deltas/testDelta.js').to.equal(selectMakePath(state));
    });

    it('selectMakeTemplate should get template file', () => {
        expect('deltas/template.hbs.js').to.equal(selectMakeTemplate(state));
    });

    it('selectMakeContext should get template context', () => {
        expect({ name: 'testDelta' }).to.deep.equal(selectMakeContext(state));
    });
});
