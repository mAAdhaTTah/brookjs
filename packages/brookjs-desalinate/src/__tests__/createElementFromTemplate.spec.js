/* eslint-env mocha */
import 'core-js/fn/object/assign';
import 'core-js/fn/object/values';
import 'core-js/fn/set';
import 'core-js/fn/symbol';
import { expect } from 'chai';
import createElementFromTemplate from '../createElementFromTemplate';

describe('createElementFromTemplate', () => {
    it('creates element from template function', () => {
        const template = () => '<div>Test Element</div>';
        const state = {};

        const element = createElementFromTemplate(template, state);

        expect(element.nodeName).to.equal('DIV');
        expect(element.textContent).to.equal('Test Element');
    });
});
