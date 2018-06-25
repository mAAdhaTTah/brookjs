import path from 'path';
import changeCase from 'change-case';
import hbs from 'handlebars';
import Kefir from 'kefir';
import * as hd from './hd';

const TEMPLATE_DIR = path.join(__dirname, '..', '..', 'templates');
const templates = {};

hbs.registerHelper('upper-snake-case', val => new hbs.SafeString(changeCase.constantCase(val)));

export default tmpl => {
    if (templates[tmpl]) {
        return Kefir.constant(templates[tmpl]);
    }

    return hd.read(path.join(TEMPLATE_DIR, tmpl))
        .map(contents => templates[tmpl] = hbs.compile(contents));
};
