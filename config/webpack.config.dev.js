const webpackMerge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.config.base')

const webpackconfig = webpackMerge(baseWebpackConfig, {
  devtool: 'eval-source-map',
  mode: 'development',
  stats: {
    children: false //不显示依赖的调试信息
  }
})

module.exports = webpackconfig
