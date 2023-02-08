/* eslint-disable @typescript-eslint/no-var-requires */
const Webpack = require('webpack');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const { SOLANA_NETWORK = 'mainnet' } = env;

  if (SOLANA_NETWORK === 'mainnet') {
    require('dotenv').config({ path: './.env' });
    require('dotenv').config({ path: './.env.production' });
  } else {
    require('dotenv').config({ path: './.env.development' });
  }

  return {
    mode: 'development',
    entry: {
      index: './src/index.tsx',
    },
    devServer: {
      static: './public',
      port: 3000,
      historyApiFallback: true,
      hot: true,
      client: {
        overlay: true,
      },
    },
    devtool: 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                getCustomTransformers: () => ({
                  before: [ReactRefreshTypeScript()].filter(Boolean),
                }),
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-modules-typescript-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]--[hash:base64:5]',
                },
              }
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico|webp)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      fallback: {
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: false,
        fs: false,
      },
    },
    plugins: [
      new ReactRefreshPlugin(),
      new HTMLWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        filename: 'index.html',
        manifest: './public/manifest.json',
      }),
      new Webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new Webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new Webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
    ],
  };
};
