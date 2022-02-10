const path = require('path')
const os = require('os')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
  mode: 'development',
  output: {
    path: path.join(process.cwd(), './build'),
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
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
            options: {
            },
          },
          {
            loader: 'css-loader',
            options: {
            },
          },
          {
            loader: 'less-loader',
            options: {
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif|mp3|eot|ttf|woff)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: 'static/media/',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.less', '.css'],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [`${path.resolve(process.cwd(), './build')}/**/*`]
    }),
  ],
  devtool: false,
  devServer: {
    contentBase: path.join(process.cwd(), 'public'),
    https: true,
    open: true,
    host: os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0',
    disableHostCheck: true,
    port: 12390,
    hot: true,
  },
}

module.exports = config
