const { defineConfig } = require('@vue/cli-service')

// function mock (app, url, data) {
//   app.get(url, (request, response) => {
//     response.json(data)
//   })
// }

// const homeData = require('./src/mock/bookHome')
// const shelfData = require('./src/mock/bookShelf')
// const listData = require('./src/mock/bookList')
// const flatListData = require('./src/mock/bookFlatList')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    // 由webpack4的before改成webpack5的onBeforeSetupMiddleware
    // onBeforeSetupMiddleware (devServer) {
    //   mock(devServer.app, '/book/home', homeData)
    //   mock(devServer.app, '/book/shelf', shelfData)
    //   mock(devServer.app, '/book/list', listData)
    //   mock(devServer.app, '/book/flat-list', flatListData)
    // }
    // 代理
    // proxy: {
    //   '/api': {
    //     target: 'http://47.99.166.157/epub2',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  }

})
