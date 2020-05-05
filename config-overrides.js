const { injectBabelPlugin } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
module.exports = function override(config, env) {
  config = rewireLess.withLoaderOptions({
    modifyVars: { '@primary-color': '#9F35FF' },
  })(config, env)
  return config
}
