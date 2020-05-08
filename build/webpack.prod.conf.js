const config = require('../config')
const utils = require('./utils')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const WebpackMd5Hash = require("webpack-md5-hash")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ProgressWebpackPlugin = require('progress-bar-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('[chunkhash].[name].js'),
    chunkFilename: utils.assetsPath('[chunkhash].[name].js'),
    sourceMapFilename: utils.assetsPath('[chunkhash].[name].js.map'),
    publicPath: config.build.assetsPublicPath,
    chunkLoadTimeout: config.build.chunkLoadTimeout
  },
  // module: {
  //   rules: utils.styleLoaders({
  //     sourceMap: config.build.productionSourceMap,
  //     extract: true
  //   })
  // },
  plugins: [
    new ProgressWebpackPlugin(),
    new CleanWebpackPlugin(),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: 'index.html',
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },

      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    }),
    new WebpackMd5Hash()
  ]
})
