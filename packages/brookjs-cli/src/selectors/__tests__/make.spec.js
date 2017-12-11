/* eslint-env mocha */
import { expect, use } from 'chai';
import dirty from 'dirty-chai';
import R from 'ramda';
import { lCommandName } from '../../lenses';
import { isMakeCommand, selectBarrelPath, selectExportTemplate, selectMakeContext } from '../make';

const state = {
    command: {
        name: 'make',
        args: {
            type: 'delta',
            name: 'testDelta'
        },
        opts: {
            file: 'test'
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

    it('selectBarrelPath should get target path', () => {
        expect(selectBarrelPath(state)).to.equal('deltas/index.js');
    });

    it('selectExportTemplate should get template file', () => {
        expect(selectExportTemplate(state)).to.equal('deltas/export.hbs.js');
    });

    it('selectMakeContext should get template context', () => {
        expect(selectMakeContext(state)).to.deep.equal({ name: 'testDelta', file: 'test' });
    });
});
