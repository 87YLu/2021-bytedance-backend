const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './app/index.ts',
  mode: 'production',
  module: {
    unknownContextCritical: false,
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  externals: [nodeExternals()],
  externalsPresets: { node: true },
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    extensions: ['.ts'],
    alias: {
      '@db': path.join(__dirname, './config/db.ts'),
      '@email': path.join(__dirname, './config/email.ts'),
      '@models': path.join(__dirname, './app/models'),
      '@controllers': path.join(__dirname, './app/controllers'),
      '@routes': path.join(__dirname, './app/routes'),
    },
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
}
