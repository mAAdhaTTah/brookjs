import { Parser } from 'htmlparser2';
import parseAttributes from './attributes';
import { placeholderize } from './placeholder';
import { parseText } from './text';

const defaults = {
    root: true,
    knownHelpers: [
        'each',
        'if',
        'unless',
        'with',
    ]
};

/**
 * Precompiles a handlebars template into a template spec for diffhtml's
 * createTree function.
 *
 * @param {string} source - HTML to precompile into a template spec.
 * @param {Object} opts - Precompilation options.
 * @param {Object|Object[]} tree - Compiled tree.
 * @returns {Object} Template spec.
 */
export default function parse(source, opts = {}, tree = ['#document-fragment', [], []]) {
    const config = Object.assign({}, defaults, opts, { knownHelpers: defaults.knownHelpers.concat(opts.knownHelpers) });
    const [expressions, /* blocks */, html] = placeholderize(source);

    const path = [];
    let active = tree;

    const parser = new Parser({
        /**
         * Parses the opening tag and appends a new Node to the tree.
         *
         * @param {string} tagname - String representation of tag.
         * @param {Object} attributes - Tag attributes.
         */
        onopentag: (tagname, attributes) => {
            path.push(active);

            const child = [tagname, parseAttributes(attributes, expressions), []];

            active[2].push(child);

            active = child;
        },

        /**
         * Parses the tag's text into a template spec.
         *
         * @param {string} text - Text node contexts.
         */
        ontext: text => {
            active[2].push(...parseText(text, expressions));
        },

        /**
         * Sets the parser to work on the parent tree again.
         *
         * @param {string} tagname - Tagname closed.
         */
        onclosetag: tagname => {
            if (active[0] !== tagname) {
                throw new Error(`${tagname} was improperly closed. saw ${tagname} first.`);
            }

            active = path.pop();
        }
    });

    parser.write(html);
    parser.end();

    if (!config.root) {
        return tree;
    }

    if (tree[2].length > 1) {
        return tree;
    }

    return tree[2].pop() || null;
}
