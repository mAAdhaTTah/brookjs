/*eslint-env mocha */
import 'core-js/shim';
import { AssertionError } from 'assert';
import R from 'ramda';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiKefir from 'chai-kefir';
import dom from 'chai-dom';
import { component } from '../';
import Kefir from '../../kefir';

chai.use(dom);
chai.use(sinonChai);

const { plugin, prop } = chaiKefir(Kefir);
chai.use(plugin);

describe('component', () => {
    describe('module', () => {
        it('should be a function', () => {
            expect(component).to.be.a('function');
        });

        it('should return a factory function', () => {
            expect(component({})).to.be.a('function');
        });
    });

    describe('factory', () => {
        it('should require an HTMLElement', () => {
            const invalid = [{}, 'string', 2, true, [], R.identity];

            invalid.forEach(el => {
                expect(() => component({})(el, {})).to.throw(AssertionError);
            });
        });

        it('should require an observable', () => {
            const invalid = [{}, 'string', 2, true, []];

            invalid.forEach(state => {
                expect(() => component({})(document.createElement('div'), state)).to.throw(AssertionError);
            });
        });

        it('should return an observable', () => {
            expect(component({})(document.createElement('div'), prop())).to.be.observable();
        });
    });
});
