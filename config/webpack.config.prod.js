const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const webpackConfig = webpackMerge(baseWebpackConfig, {
  mode: 'production',
  stats: { children: false, warnings: false }, //打包时不要依赖信息，不要警告信息
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          //压缩时不要警告
          warnings: false,
          compress: {
            //上线后启用所有的console函数
            drop_console: false,
            dead_code: true, // 去除访问不到的代码
            drop_debugger: true //去除debugger语句
          },
          output: {
            comments: false, //删除注释
            beautify: false //输出是否美化，即语句全部是在单行上的
          },
          mangle: true //压碎，即混淆
        },
        parallel: true, // 是否使用多线程来提高打包速度，默认为os.cpus().length - 1
        sourceMap: true
      })
    ],
    //按需分离公共代码
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce: true
        }
      }
    }
  }
})

module.exports = webpackConfig
