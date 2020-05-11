var path = require('path')
var config = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageConfig = require('../package.json')


exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  var sassLoader = {
    loader: 'sass-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  
  const loaders = [cssLoader, postcssLoader]

  if (options.useSass) loaders.push(sassLoader)

  // Extract CSS when that option is specified
  // (which is the case during production build)
  if (options.extract) {
    return [MiniCssExtractPlugin.loader].concat(loaders)
  }
  return loaders
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.jpg'),
    })
  }
}

exports.ExtractScriptIntoHeadWebpackPlugin = class {
  constructor(options = {}) {
    this.inject = options.inject || 'after'
    this.testRe = options.test || []
  }
  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.hooks
        .htmlWebpackPluginAlterAssetTags
        .tapAsync('extract-script-into-head', (data, callback) => {
          let { head, body } = data
          let handle = this.inject === 'before'
            ? head.unshift.bind(head)
            : head.push.bind(head)

          for (let i = 0; i < body.length; i++) {
            let script = body[i]
            if (match(this.testRe, script)) {
              handle(script)
              body.splice(i, 1)
              i--
            }
          }

          callback(null, data)

          function match(testRe, script) {
            return testRe.some(re => {
              let { attributes: { src } } = script
              return (
                re instanceof RegExp &&
                re.test(src)
              )
            })
          }
        })
    })
  }
}