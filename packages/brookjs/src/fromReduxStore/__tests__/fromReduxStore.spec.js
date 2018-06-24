/* eslint-env mocha */
import 'core-js/shim';
import chai, { expect } from 'chai';
import { chaiPlugin } from 'brookjs-desalinate';
import $$observable from 'symbol-observable';
import Kefir from '../../kefir';
import fromReduxStore from '../';

const { plugin, value } = chaiPlugin({ Kefir });
chai.use(plugin);

const createMockStore = state => {
    const store = {
        state,
        callbacks: [],

        setState (state) {
            store.state = state;

            store.runCallbacks();
        },

        getState () {
            return store.state;
        },

        subscribe (callback) {
            store.callbacks.push(callback);
        },

        runCallbacks () {
            store.callbacks.forEach(callback => callback());
        },

        [$$observable] () {
            return {
                subscribe: observer => {
                    const observe = () => observer.next(store.getState());

                    observe();

                    const unsubscribe = store.subscribe(observe);

                    return { unsubscribe };
                },

                [$$observable] () {
                    return this;
                }
            };
        }
    };

    return store;
};

describe('fromReduxStore', () => {
    it('should be a function', () => {
        expect(fromReduxStore).to.be.a('function');
    });

    it('should return a property', () => {
        const store = createMockStore();

        expect(fromReduxStore(store)).to.be.an.observable.property();
    });

    it('should emit the initial value', () => {
        const store = createMockStore(true);
        const state$ = fromReduxStore(store);

        expect(state$).to.emit([value(true, { current: true })]);
    });

    it('should emit new values', () => {
        const store = createMockStore(true);
        const state$ = fromReduxStore(store);

        expect(state$).to.emit([value(true, { current: true }), value(false)], () => {
            store.setState(false);
        });
    });
});
