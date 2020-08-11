const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启gzip压缩
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devServer: {
    open: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    proxy: {
      '/v1': {
        target: 'http://175.24.246.132:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/v1/': '/v1/'
        }
      }
    }
  },
  configureWebpack: config => {
    if (isProd) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.js$|\.html$|\.css$|\.png$/,
          // 超过4kb 压缩
          threshold: 4096
        })
      )
    }
  }
  // productionSourceMap: false  // 打包时，是否开启map文件
  // publicPath: './'
}