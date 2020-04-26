const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/webmaster-front/',
  },
}
