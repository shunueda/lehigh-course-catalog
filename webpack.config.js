const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                use: 'json-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.ts', '.js'],
        fallback: {
            electron: false
        }
    },

    output: {
        filename: 'index.js',
        path: path.resolve('prod')
    },
    plugins: [],
    experiments: {
        topLevelAwait: true
    },
    externals: [nodeExternals()],
    mode: 'production'
}
