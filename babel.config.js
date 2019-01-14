module.exports = api => {
    api.cache(false);

    return {
        plugins: [
            '@babel/plugin-proposal-class-properties',
            'ramda'
        ].filter(Boolean),
        presets: [
            'brookjs',
            ['@babel/env', {
                modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false
            }]]
    };
};
