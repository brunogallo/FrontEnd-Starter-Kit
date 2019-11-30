const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';
const entryPlus = require('webpack-entry-plus');
const glob = require('glob');
let autoprefixer = require ('autoprefixer');
let webpack = require('webpack');

const entryFiles = [
  {
    entryFiles: glob.sync('./src/**/*.js'),
    outputName(item) {
      return item.replace('src/', '../dist/').replace('.js', '');
    }
  }
];

module.exports = {
  entry: entryPlus(entryFiles),
  output: {
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: 'postcss',
              config: {
                path: `${__dirname}/postcss.config.js`
              },
              minimize: false
            }
          },
          "sass-loader"]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CopyPlugin([
      { from: './src/assets/styles/helpers/normalize.css', to: './assets/css/normalize.css' },
      { from: './src/assets/fonts/', to: './assets/fonts/' },
    ]),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'] }
    })
  ]
};