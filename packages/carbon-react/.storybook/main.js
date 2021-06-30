/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: true,
        backgrounds: true,
        controls: true,
        docs: true,
        toolbars: true,
        viewport: true,
      },
    },
  ],
  stories: [
    './Welcome/Welcome.stories.js',
    '../src/**/*.stories.js',
    '../src/**/*.stories.mdx',
  ],
  webpack(config) {
    const babelLoader = config.module.rules.find((rule) => {
      return rule.use.some(({ loader }) => {
        return loader.includes('babel-loader');
      });
    });

    // This is a temporary trick to get `babel-loader` to ignore packages that
    // are brought in that have an es, lib, or umd directory.
    //
    // Typically this is covered by /node_modules/ (which is the default), but
    // in our case it seems like these dependencies are resolving to where their
    // symlink points to. In other words, `@carbon/icons-react` becomes
    // `../icons-react/es/index.js`.
    //
    // This results in these files being included in `babel-loader` and causing
    // the build times to increase dramatically
    babelLoader.exclude = [/node_modules/, /packages\/.*\/(es|lib|umd)/];

    config.module.rules.push({
      test: /\.s?css$/,
      sideEffects: true,
      use: [
        {
          loader:
            process.env.NODE_ENV === 'production'
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('postcss-custom-properties')(),
                require('autoprefixer')({
                  overrideBrowserslist: ['last 1 version'],
                }),
              ],
            },
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            additionalData(content) {
              return content;
            },
            sassOptions: {
              implementation: require('sass'),
              includePaths: [
                path.resolve(__dirname, '..', 'node_modules'),
                path.resolve(__dirname, '..', '..', '..', 'node_modules'),
              ],
            },
            sourceMap: true,
          },
        },
      ],
    });

    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
        })
      );
    }

    return config;
  },
};
