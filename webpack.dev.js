const { merge } = require('webpack-merge');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js',
    },
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