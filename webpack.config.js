// Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const prod = process.env.NODE_ENV === 'production';

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    Popper: ['popper.js', 'default'],
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.bundle.js',
  }),
  new ExtractTextPlugin('[name].css'),
];

if (prod) {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      comments: /^\**!|@preserve|copyright|license/i,
    }),
  ]);
}

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'browser/tsconfig.json',
        },
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(woff2?|svg)(\?v=[\d\.]+)?$/,
        loader: 'url-loader?limit=10000',
      },
      {
        test: /\.(png|ttf|eot)(\?v=[\d\.]+)?$/,
        loader: 'file-loader',
      },
    ],
  },

  entry: {
    app: ['./browser/app.tsx'],
    vendor: [
      'core-js/shim',
      'bootstrap',
      'history',
      'jquery',
      'moment',
      'popper.js',
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'react-select',
      'redux',
      'whatwg-fetch',
    ],
    style: ['./styles/style.scss'],
  },

  output: {
    path: path.join(__dirname, '/build/res'),
    filename: '[name].js',
    publicPath: '/res/',
  },

  devtool: prod ? 'source-map' : 'cheap-module-source-map',

  plugins: plugins,

  devServer: {
    port: 8010,
    publicPath: '/res/',
    proxy: {
      '*': 'http://localhost:8000',
    },
    stats: 'minimal',
  },
};
