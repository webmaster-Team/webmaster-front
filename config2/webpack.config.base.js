const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //清除output下的所有文件
const utils = require('./utils')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const uglify = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const  OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// debugger

const webpackconfig = {
  //说明包的部署环境
  target: 'web',
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
        test: /\.css$/,
        use:[
          MiniCssExtractPlugin.loader,
          {loader: 'css-loader'},
        ]
      },
      {
        test: /\.styl$/,
        exclude: [path.resolve(__dirname, '../node_modules')],
        use:[MiniCssExtractPlugin.loader,
          {loader: 'css-loader'},
          {loader: 'stylus-loader'}
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [path.resolve(__dirname, '../node_modules')],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use:[
          {
            loader : 'url-loader',
            // exclude: [path/this.resolve(__dirname,'../public')],
            options:{
              limit: 1024,
              name: 'img/[name]-image.[ext]'
            }
          }
        ]
      },
    ],
  },
  plugins: [
    require('autoprefixer'),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/[name].css'
     }),
    new uglify(),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(__dirname,'../public/assets/swiper'), to: path.join(__dirname,'../build/assets/swiper')},
        { from: path.join(__dirname,'../public/assets/favicon.ico'), to: path.join(__dirname,'../build/assets/favicon.ico')},
        { from: path.join(__dirname,'../public/assets/iconfont.js'), to: path.join(__dirname,'../build/assets/iconfont.js')},
        { from: path.join(__dirname,'../public/assets/manifest.json'), to: path.join(__dirname,'../build/assets/manifest.json')},
        { from: path.join(__dirname,'../public/assets/logo192.png'), to: path.join(__dirname,'../build/assets/logo192.png')},
        { from: path.join(__dirname,'../public/assets/logo512.png'), to: path.join(__dirname,'../build/assets/logo512.png')},
      ]
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:
          process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'prod'
            ? '"production"'
            : '"developement"',
      },
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
          preset: [
              'default',
              { discardComments: { removeAll: true } }
              ],
      },
      canPrint: true
  }),
  new HtmlWebpackPlugin({
      template: './public/index.html',
      filename:'./index.html',
      minify:{
         removeComments:true,//清除注释                 
         collapseWhitespace:true//清理空格
      },
    })
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
