module.exports = {
  devServer: {
    open: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    proxy: {
      '/v1': {
        target: 'http//customer/page',
        changeOrigin: true,
        pathRewrite: {
          '^/v1/': '/v1/'
        }
      }
    }
  },
  publicPath: './'
}