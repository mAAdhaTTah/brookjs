import fs from 'fs-extra';
import { createPlugin } from 'docz-core';
import pkg from './packages/brookjs/package.json';

const renderRoutes = createPlugin({
    onPostBuild() {
        const entries = require('./.docz/app/entries.json');
        const content = fs.readFileSync('./.docz/dist/index.html', 'utf8');

        for (const key in entries) {
            const entry = entries[key];

            if (entry.route === '/') {
                continue;
            }

            fs.outputFileSync('./.docz/dist' + entry.route + 'index.html', content);
        }
    }
});

export default {
    title: pkg.name,
    base: '/brookjs/',
    description: pkg.description,
    src: './docs',
    order: 'ascending',
    plugins: [renderRoutes]
};
