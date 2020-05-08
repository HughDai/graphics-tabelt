const path = require('path')

module.exports = {
  dev: {
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: [],
    host: '0.0.0.0',
    port: 9999,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, 
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },
  build: {
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}


// proxy path to target and rewrite path
function createProxy (path, target, rewrite) {
  var proxyConf = {
    _path: path,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    target: target,
    pathRewrite: {},
  }
  if (rewrite) {
    proxyConf.pathRewrite['^' + path] = ''
  }
  return proxyConf
}
