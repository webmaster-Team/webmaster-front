const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //清除output下的所有文件
const utils = require('./utils')
// debugger

const webpackconfig = {
  //说明包的部署环境
  target: 'node',
  //定义入口
  entry: {
    //创建一个server入口
    app: path.join(utils.APP_PATH, 'index.js'),
  },
  resolve: {
    ...utils.getWeboackResolveConfig(),
  },
  output: {
    filename: '[name].bundle.js',
    path: utils.DIST_PATH,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [path.resolve(__dirname, '../node_modules')],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.styl$/,
        exclude: [path.resolve(__dirname, '../node_modules')],
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use:[
          {
            loader : 'url-loader',
            options:{
              limit: 1024,
              name: '[name]-image.[ext]'
            }
          }
        ]
      }
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:
          process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'prod'
            ? '"production"'
            : '"developement"',
      },
    }),
  ],
  node: {
    //设置Nodejs的一些api可以在脱离Nodejs环境下执行
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true,
  },
}

// console.log(webpackconfig)

module.exports = webpackconfig
