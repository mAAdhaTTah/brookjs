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
                loader: 'babel'
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
            kefir: 'kefir/src',
            redux: 'redux/es',
            handlebars: 'handlebars/dist/cjs/handlebars',
            sinon: 'sinon/pkg/sinon-2.0.0-pre.js'
        }
    }
};
