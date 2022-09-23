/* eslint-disable @typescript-eslint/no-var-requires */
const Webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env) => {
  const { SOLANA_NETWORK = 'mainnet' } = env;

  if (SOLANA_NETWORK === 'mainnet') {
    require('dotenv').config({ path: './.env.production' });
  } else {
    require('dotenv').config({ path: './.env.development' });
  }

  return {
    output: {
      publicPath: 'auto',
      path: path.resolve(__dirname, 'build'),
      filename: '[name]-[contenthash].js',
    },
    mode: 'production',
    entry: {
      index: './src/index.tsx',
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('ts-loader'),
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
                modules: true,
              },
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
            },
          ],
        },
        {
          test: /.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      fallback: {
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        filename: 'index.html',
        manifest: './public/manifest.json',
      }),
      new Webpack.ProvidePlugin({ process: 'process/browser' }),
      new Webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) }),
    ],
  };
};
