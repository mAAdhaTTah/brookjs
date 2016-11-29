import R from 'ramda';
import Handlebars from 'handlebars';
import component from '../component';
import children from '../children';
import events from '../events';
import render from '../render';

const $$helper = '$$helper';
const $$config = '$$config';

/**
 * Tagged template function for template-based component declarations.
 *
 * @param {string[]} strings - Template strings.
 * @param {function[]} values - Component lifecycle functions.
 * @returns {factory} Component factory function.
 */
const silt = function silt(strings, ...values) {
    const opts = {
        onMount: R.identity,
        children: {},
        events: {}
    };

    if (strings.length !== values.length) {
        values.push(R.identity);
    }

    const template = R.zip(strings, values).reduce(
        (acc, [string, func]) => {
            opts[func[$$config]] = func;

            return acc + string + func[$$helper];
        }, '');

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
        [$$config]: {
            value: 'onMount'
        },
        [$$helper]: {
            value: ''
        }
    });
};

export default silt;
