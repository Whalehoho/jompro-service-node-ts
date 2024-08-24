const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'production',
    target: 'node',
    devtool: 'inline-source-map',
    entry: 'src/app.ts',
    externals: [nodeExternals()],
    externalsPresets: { node: true },
    output: {
        clean: true,
        filename: 'src/app.js',
        path: path.resolve(__dirname, 'dist'),
        devtoolModuleFilenameTemplate: '/[resource-path]?[loaders]',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({ extensions: ['.ts'] })],
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
        new CopyPlugin({
            patterns: [
                {
                    from: '(package.json|ecosystem.config.js|.npmrc)',
                    info: { minimized: true },
                    noErrorOnMissing: true,
                },
                {
                    from: 'config/**/*',
                    globOptions: { ignore: ['**/(dev|development|prod|production)(*|**/*)'] },
                    info: { minimized: true },
                    noErrorOnMissing: true,
                },
                {
                    from: '.env*',
                    globOptions: { ignore: ['**/.env.(dev|development|prod|production)*'] },
                    info: { minimized: true },
                    noErrorOnMissing: true,
                },
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    watchOptions: {
        aggregateTimeout: 500,
        poll: 1000,
    },
};
