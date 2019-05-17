const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const useExternalCss =
  process.env.CARBON_REACT_STORYBOOK_USE_EXTERNAL_CSS === 'true';

const useStyleSourceMap =
  process.env.CARBON_REACT_STORYBOOK_USE_STYLE_SOURCEMAP === 'true';

const styleLoaders = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      sourceMap: useStyleSourceMap,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        require('autoprefixer')({
          browsers: ['last 1 version', 'ie >= 11'],
        }),
      ],
      sourceMap: useStyleSourceMap,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      includePaths: [path.resolve(__dirname, '..', 'node_modules')],
      data: `
        $feature-flags: (
          ui-shell: true,
        );
      `,
      sourceMap: useStyleSourceMap,
    },
  },
];

class FeatureFlagProxyPlugin {
  /**
   * A WebPack resolver plugin that proxies module request
   * for `carbon-components/es/globals/js/settings` to `./settings`.
   */
  constructor() {
    this.source = 'before-described-relative';
  }

  apply(resolver) {
    resolver.plugin(this.source, (request, callback) => {
      if (/[\\/]globals[\\/]js[\\/]settings$/.test(request.path)) {
        request.path = path.resolve(__dirname, './settings');
      }
      callback();
    });
  }
}

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.devtool = useStyleSourceMap ? 'source-map' : '';
  defaultConfig.optimization = {
    ...defaultConfig.optimization,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          mangle: false,
        },
      }),
    ],
  };

  defaultConfig.module.rules.push({
    test: /-story\.jsx?$/,
    loaders: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
        options: {
          prettierConfig: {
            parser: 'babylon',
            printWidth: 80,
            tabWidth: 2,
            bracketSpacing: true,
            trailingComma: 'es5',
            singleQuote: true,
          },
        },
      },
    ],
    enforce: 'pre',
  });

  defaultConfig.module.rules.push({
    test: /\.scss$/,
    sideEffects: true,
    use: [
      { loader: useExternalCss ? MiniCssExtractPlugin.loader : 'style-loader' },
      ...styleLoaders,
    ],
  });

  if (useExternalCss) {
    defaultConfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      })
    );
  }

  defaultConfig.resolve = {
    modules: ['node_modules'],
    plugins: [new FeatureFlagProxyPlugin()],
  };

  return defaultConfig;
};
