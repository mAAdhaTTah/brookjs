/* eslint-env mocha */
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
