const path = require('path')
const webpack = require('webpack')
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

const plugins = []
const externals = []
if (isProduction) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new UnminifiedWebpackPlugin(),
    new webpack.ProvidePlugin({
        $: "jquery"
    })
  )

  externals.push('jquery')
}

module.exports = {
  devtool: 'source-map',
  entry: {
    async_fn: ['./src/index']
  },
  output: {
    path: path.resolve('./build'),
    filename: '[name].min.js',
    library: 'AsyncFn',
    libraryTarget: 'umd'
  },
  resolve: {
    root: process.cwd(),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.coffee']
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        loaders: ['coffee']
      }
    ]
  },
  plugins: plugins,
  externals: externals
}

