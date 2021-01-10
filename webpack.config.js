const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');

module.exports = (env, argv) => {

    if (argv.mode === 'development') {
        return devConfig;
    }

    return prodConfig;
};
