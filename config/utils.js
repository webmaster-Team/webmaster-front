const path = require('path')

//exports的快捷方式写法
exports.resolve = function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

exports.APP_PATH = exports.resolve('src')
exports.DIST_PATH = exports.resolve('build')

exports.getWeboackResolveConfig = function (customAlias = {}) {
  const appPath = exports.APP_PATH
  return {
    modules: [appPath, 'node_modules'],
    extensions: ['.js', '.json'],
    alias: {
      '@': appPath,
      ...customAlias,
    },
  }
}
