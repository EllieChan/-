'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '基础微服务' // 标题

const port = process.env.port || process.env.npm_config_port || 80 // 端口

// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档

module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: process.env.outputDir,//'dist'
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'warning' | 'default' | 'error'  
  // 设置为true、warning会将lint错误输出为编译警告，警告仅仅会被输出到命令行，且不会使得编译失败
  // false、default、error会将lint错误也输出编译错误，但也会导致编译失败
  lintOnSave: process.env.NODE_ENV === 'development',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    proxy: {
      //如果你的前端应用和后端API服务器没有运行在同一个主机上，你需要在开发环境下将API请求代理到API服务器
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://117.36.73.44:8080`, //代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, //接口跨域，需要配置这个参数
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '' //重写之后url地址
        }
      }
    },
    disableHostCheck: true //设置为true时，此选项将绕过主机检查，不建议这样做，因为不检查主机的应用容易受到DNS绑定攻击
  },
  // 如果这个值是一个对象，则会通过webpack-merge合并到最终的配置中
  // 如果这个值是一个函数，则会接收被解析的配置作为参数，该函数既可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  // 是一个函数，会接收一个基于webpack-chain的chainbleconfig实例，允许对内部的webpack配置记性一个细粒度的修改
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    //rule 创建可以在以后修改的命名
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    //when() 有条件的执行函数以继续配置
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({ //splitChunks是用来设置代码如何打包和分割的
              chunks: 'all', //async 异步代码分割 initial同步代码分割 all同步异步分割都开启
              cacheGroups: { //缓存组，将所有加载模块放在缓存里面一起分割打包
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          //如果不设置runtimeChunk，在每次打包构建时app.js的hash值都会改变，用户端的浏览器每次都要重新加载变化后的app.js，不能缓存在浏览器中，导致用户体验差
          //作用是为了线上更新版本时，充分利用浏览器缓存，使用户感知的影响到最低
          config.optimization.runtimeChunk('single'), //值 "single" 会创建一个在所有生成 chunk 之间共享的运行时文件

            {
              from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
              to: './', //到根目录下
            }
        }
      )
  }
}
