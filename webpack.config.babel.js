import webpack from 'webpack'

const { NODE_ENV } = process.env

const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    })
]

const filename = 'index.js'

NODE_ENV === 'production' && plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true,
            warnings: false
        }
    })
)

export default {
    module: {
        rules: [
            { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ }
        ]
    },

    entry: [
        './src/index'
    ],

    output: {
        path: __dirname,
        filename,
        library: 'ReduxDefMap',
        libraryTarget: 'umd'
    },

    plugins
}
