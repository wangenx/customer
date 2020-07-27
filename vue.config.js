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
  }
  // publicPath: './'
}