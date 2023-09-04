const CopyPlugin = require('copy-webpack-plugin')
const path = require('node:path')

module.exports = {
  mode: process.env['NODE_ENV'],
  entry: './ext/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'ext/icons', to: 'icons' },
        { from: 'ext/manifest.json', to: 'manifest.json' },
        { from: 'ext/src', to: 'src' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
}
