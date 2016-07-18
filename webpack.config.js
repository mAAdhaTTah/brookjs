module.exports = {
    entry: {},
    output: {
        path: './dist/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules)/
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    resolve: {
        mainFields: ['jsnext:main', 'browser', 'main'],
        alias: {
            handlebars: 'handlebars/dist/cjs/handlebars',
            sinon: 'sinon/pkg/sinon-2.0.0-pre.js'
        }
    }
};
