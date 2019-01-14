module.exports = api => {
    api.cache(false);

    return {
        plugins: [
            '@babel/plugin-proposal-class-properties',
            'ramda',
            process.env.NODE_ENV === 'test' && '@babel/transform-modules-commonjs'
        ].filter(Boolean),
        presets: ['brookjs', '@babel/typescript', '@babel/env'],
        env: {
            test: {
                plugins: ['@babel/transform-modules-commonjs']
            }
        }
    };
};
