import path from 'path';
import { Kefir } from 'brookjs';
import hbs from 'handlebars';
import * as hd from './hd';

const TEMPLATE_DIR = path.join(__dirname, '..', '..', 'templates');
const templates = {};

export default tmpl => {
    if (templates[tmpl]) {
        return Kefir.constant(templates[tmpl]);
    }

    return hd.read(path.join(TEMPLATE_DIR, tmpl))
        .map(contents => templates[tmpl] = hbs.compile(contents));
};
