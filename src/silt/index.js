import R from 'ramda';
import Handlebars from 'handlebars';
import { never } from 'kefir';
import { eventAttribute } from '../helpers';
import component from '../component';
import children from '../children';
import events from '../events';
import render from '../render';

const $$attribute = '$$attribute';
const $$config = '$$config';
const $$key = '$$key';
const $$onMount = '$$onMount';

/**
 * Tagged template function for template-based component declarations.
 *
 * @param {string[]} strings - Template strings.
 * @param {Array<string|Function>} values - Component lifecycle functions.
 * @returns {factory} Component factory function.
 */
const silt = function silt(strings, ...values) {
    const opts = {
        onMount: R.always(never()),
        children: {},
        events: {}
    };

    if (strings.length !== values.length) {
        values.push(R.identity);
    }

    let hasContainer = false;

    const template = R.zip(strings, values).reduce(
        (acc, [string, func]) => {
            if (typeof func === 'string') {
                if (func.indexOf('data-brk-container') !== -1) {
                    hasContainer = true;
                }

                return acc + string + func;
            }

            if (func[$$onMount]) {
                opts.onMount = func;
            } else if (func[$$config]) {
                Object.assign(opts[func[$$config]], {
                    [func[$$key]]: func
                });
            }

            return acc + string + (func[$$attribute] || '');
        }, '');

    if (!hasContainer) {
        throw new Error('Component does not have container');
    }

    return component({
        onMount: opts.onMount,
        children: children(opts.children),
        events: events(opts.events),
        render: render(Handlebars.compile(template))
    });
};

/**
 * Tags a function as an onMount function for use by silt.
 *
 * @param {Function} func - Function to tag.
 * @returns {Function} Function with tagged attributes.
 */
export const onMount = silt.onMount = function onMount(func) {
    return Object.defineProperties(func, {
        [$$onMount]: {
            value: true
        }
    });
};

let id = 0;

/**
 * Tags a function as an event function for use by silt.
 *
 * @param {string} type - Event type.
 * @param {Function} func - Function to tag
 * @returns {Function} Function with tagged attributes.
 */
export const event = silt.event = function event(type, func) {
    const key = `silt${id++}`;

    return Object.defineProperties(func, {
        [$$config]: {
            value: 'events'
        },
        [$$attribute]: {
            value: eventAttribute(type, key)
        },
        [$$key]: {
            value: key
        }
    });
};

export default silt;
