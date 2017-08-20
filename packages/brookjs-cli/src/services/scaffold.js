import path from 'path';
import R from 'ramda';
import { Kefir } from 'brookjs';
import { fileCreated, scaffoldError } from '../actions';
import { lAppDir } from '../lenses';
import { selectRoot } from '../selectors';
import * as hd from './hd';
import template from './template';

const APP = Symbol('beaver.scaffold.app');
const CREATE = Symbol('beaver.scaffold.create');
const ROOT = Symbol('beaver.scaffold.root');

const selectPath = (state, spec) => {
    let dest = selectRoot(state);

    if (spec.target === APP) {
        dest = path.join(dest, R.view(lAppDir, state));
    }

    return path.join(dest, spec.path);
};

const selectContext = (state, { context }) => {
    if (!context) {
        return {};
    }

    if (typeof context === 'object') {
        return context;
    }

    if (typeof context === 'function') {
        return context(state);
    }

    return {};
};

const mapSpecToStreams = R.curry((state, spec) => {
    switch (spec.action) {
        case CREATE:
            if (typeof spec.content === 'string') {
                return hd.write(selectPath(state, spec), spec.content)
                    .map(() => fileCreated(spec.path));
            }

            if (typeof spec.template === 'string') {
                return template(spec.template)
                    .map(tmpl => tmpl(selectContext(state, spec)))
                    .flatMap(content => hd.write(selectPath(state, spec), content))
                    .map(() => fileCreated(spec.path));
            }

            return Kefir.constantError(new TypeError(`Invalid spec: ${spec.path}. No content or template.`));
        default:
            return Kefir.constantError(new TypeError(`Invalid action: ${spec.action}`));
    }
});

const scaffold = R.curry((specs, state) =>
    Kefir.merge(R.map(mapSpecToStreams(state), specs))
        .flatMapErrors(err => Kefir.constant(scaffoldError(err))));

scaffold.APP = APP;
scaffold.CREATE = CREATE;
scaffold.ROOT = ROOT;

export default scaffold;
