const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const path = require('node:path')

module.exports = {
  mode: process.env['NODE_ENV'],
  devtool: false,
  entry: {
    main: './ext/main.ts',
    index: './source/src/main.tsx'
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: 'http://localhost:3000',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'ext/icons', to: 'icons' },
        { from: 'ext/manifest.json', to: 'manifest.json' },
      ],
    }),
    new HtmlWebpackPlugin({ inject: 'body', template: './source/index.html', excludeChunks: ['main'] }),
    new HtmlInlineScriptPlugin({ htmlMatchPattern: [/index.html$/] })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", {"runtime": "automatic"}],
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.m?js/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader', options: { injectType: 'singletonStyleTag' } },
          'css-loader'
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|json|woff2)$/,
        type: 'asset/inline'
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devServer: {
    open: true
  }
}
