const { merge } = require('webpack-merge');
const { createProxyMiddleware } = require('http-proxy-middleware');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 4200,
        proxy: {
            '/api':
            createProxyMiddleware({
                target: 'http://localhost:8090',
                changeOrigin: true,
            })
        }
    },
});