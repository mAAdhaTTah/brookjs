import R from 'ramda';
import Handlebars from 'handlebars';
import { never } from 'kefir';
import { eventAttribute } from '../helpers';
import component from '../component';
import { CONTAINER_ATTRIBUTE } from '../constants';
import children from '../children';
import events from '../events';
import render from '../render';

const $$attribute = '$$attribute';
const $$config = '$$config';
const $$key = '$$key';
const $$onMount = '$$onMount';
const $$partial = '$$partial';
const $$template = '$$template';

/**
 * Tagged template function for template-based component declarations.
 *
 * @param {string[]} strings - Template strings.
 * @param {Array<string|Function>} values - Component lifecycle functions.
 * @returns {factory} Component factory function.
 */
const silt = function silt(strings, ...values) {
    const defaults = {
        onMount: never,
        children: {},
        events: {},
        template: ''
    };

    if (strings.length !== values.length) {
        values.push(R.identity);
    }

    const opts = R.zip(strings, values).reduce(
        (opts, [string, func]) => {
            if (typeof func === 'string') {
                return Object.assign(opts,{
                    template: opts.template + string + func
                });
            }

            if (func[$$onMount]) {
                return Object.assign(opts, {
                    onMount: func,
                    template: opts.template + string + (func[$$attribute] || '')
                });
            }

            if (func[$$config]) {
                return Object.assign(opts, {
                    [func[$$config]]: Object.assign(opts[func[$$config]], {
                        [func[$$key]]: func
                    }),
                    template: opts.template + string + (func[$$attribute] || '')
                });
            }

            return Object.assign(opts, {
                template: opts.template + string + (func[$$attribute] || '')
            });
        }, defaults);

    const hasContainerAttribute = opts.template.indexOf(CONTAINER_ATTRIBUTE) !== -1;
    const hasContainerHelper = opts.template.indexOf('{{container') !== -1;

    if (!hasContainerAttribute && !hasContainerHelper) {
        throw new Error('Component does not have container');
    }

    let container;

    if (hasContainerAttribute) {
        [,container] = opts.template.match(/data-brk-container="([\w]*)"/);
    }

    if (hasContainerHelper) {
        [, container] = opts.template.match(/\{\{container "(\w*)"\}\}/);
    }

    const compiledTemplate = Handlebars.compile(opts.template);

    const factory = component({
        onMount: opts.onMount,
        children: children(opts.children),
        events: events(opts.events),
        render: render(compiledTemplate)
    });

    Handlebars.registerPartial(factory[$$partial] = container, factory[$$template] = compiledTemplate);

    return factory;
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

/**
 * Tags a function as a child function for use by silt.
 *
 * @param {Function} factory - Child factory function.
 * @param {Object} opts - Child stream options.
 * @returns {Function} Function with tagged attributes.
 */
export const child = silt.child = function child(factory, opts = {}) {
    return Object.defineProperties(Object.assign({}, { factory }, opts), {
        [$$config]: {
            value: 'children'
        },
        [$$attribute]: {
            value: `{{> ${factory[$$partial]}}}`
        },
        [$$key]: {
            value: factory[$$partial]
        }
    });
};

export default silt;
