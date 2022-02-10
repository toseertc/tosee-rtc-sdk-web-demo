const fs = require('fs')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./webpack.config.base')

const config = webpackMerge(baseConfig, {
  entry: {
    index: './src/index.tsx',
  },
  target: 'web',
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      templateContent: fs.readFileSync('./public/index.html').toString(),
      filename: 'index.html',
    }),
  ],
})

module.exports = config