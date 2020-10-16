// webpack.config.js
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  // we use webpack-node-externals to excludes all node deps.
  // You can manually set the externals too.
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  externals: [nodeExternals()],
}
