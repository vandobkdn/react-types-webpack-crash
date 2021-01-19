const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const dotenv = require('dotenv');
const localProxy = require('./local.dev.proxy.js');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const resolveApp = relativePath => path.resolve(fs.realpathSync(process.cwd()), relativePath);

// config after eject: we're in ./config/
const paths = {
    dotenv: resolveApp('.env'),
    appPath: resolveApp('.'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appTsConfig: resolveApp('tsconfig.json'),
    proxySetup: resolveApp('src/setupProxy.js'),
    appNodeModules: resolveApp('node_modules'),
    appIndex: 'src/index.tsx',
};

module.exports = (env) => {
    const isEnvDevelopment = env.development || false;
    const isEnvProduction = env.production || false;

    let envPlugins = [];

    if (isEnvDevelopment) {
        dotenv.config({path: './environment/.env-development'});
        envPlugins = [
            ...envPlugins,
            new CaseSensitivePathsPlugin(),           // Watcher doesn't work well
            new webpack.HotModuleReplacementPlugin(), // This is necessary to emit hot updates (CSS and Fast Refresh)
        ]
    } else if (isEnvProduction) {
        dotenv.config({path: './environment/.env-production'});
        envPlugins = [
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]) // Inlines the webpack runtime script as smaller
        ]
    }

    const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');

    return {
        mode: process.env.APP_MODE,
        devtool: process.env.DEV_TOOL,
        entry: {
            app: path.join(__dirname, 'src', 'index.tsx')
        },
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: '[name].[contenthash:8].bundle.js'
        },
        devServer: {
            port: process.env.SERVER_PORT || 3000,
            ...isEnvDevelopment && {
                ...localProxy,
                compress: true,
                stats: 'minimal',
                inline: true,
                overlay: true,
                disableHostCheck: true,
                historyApiFallback: true,
                open: env.development || false,
            }
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react",
                                "@babel/preset-typescript",
                            ],
                        },
                    },
                },
                {
                    test: /\.(css|scss)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(bmp|gif|png|sgv|jpg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                limit: imageInlineSizeLimit,
                                name: 'static/images/[name].[hash:8].[ext]',
                            },
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: [
                '.js',
                '.jsx',
                '.tsx',
                '.ts'
            ],
            plugins: [new TsConfigPathsPlugin()]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src', 'index.html'),
            }),
            new webpack.DefinePlugin( {
                "process.env": {
                    APP_TITLE: JSON.stringify(process.env.APP_TITLE),
                    FACE_BOOK_APP_ID: JSON.stringify(process.env.FACE_BOOK_APP_ID),
                    GOOGLE_APP_CLIENT_ID: JSON.stringify(process.env.GOOGLE_APP_CLIENT_ID),
                }
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            ...envPlugins,
        ],
        optimization: {
            minimize: isEnvProduction,
            runtimeChunk: {
                name: entrypoint => `runtime-${entrypoint.name}`
            },
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        }
    };
};

