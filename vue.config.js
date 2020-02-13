const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const glob = require('glob')
let pages = {}
// let entries = './src/pages/**/app.js'
let path = './src/pages/**/**/'
let entries = `${path}app.js`
let staticEntris = `${path}entry.js`
let chunkNameList = []
let entriesList = glob.sync(entries)
let staticEntresList = glob.sync(staticEntris)
if (entriesList.length > 0) {
  entriesList.forEach(files => {
    const chunkName = files.split('./src/pages/')[1].split('/app.js')[0]
    chunkNameList.push(chunkName)
    pages[chunkName] = {
      entry: files,
      inlineSource: '.(css)$',
      template: files.replace(/.js/g, '.html'),
      chunks: ['vendors', 'chunk-common', chunkName],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }
  })
}

if (staticEntresList.length > 0) {
  staticEntresList.forEach(files => {
    const chunkName = files.split('./src/pages/')[1].split('/entry.js')[0]
    chunkNameList.push(chunkName)
    pages[chunkName] = {
      entry: files,
      inlineSource: '.(app.*.js|css)$',
      template: files.replace(/.js/g, '.html'),
      chunks: [chunkName],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    }
  })
}

module.exports = {
  // 项目部署的基础路径
  publicPath: process.env.BASE_URL,

  // 将构建好的文件输出到哪里
  outputDir: process.env.OUT_PUT_DIR,

  // 用于嵌套生成的静态资产（js，css，img，fonts）的目录。
  assetsDir: '',

  // 多页模式
  pages,

  // 是否在保存的时候使用 `eslint-loader` 进行检查。
  // 有效的值：`ture` | `false` | `"error"`
  // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
  lintOnSave: true,

  // 使用带有浏览器内编译器的完整构建版本
  // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
  // compiler: false,

  // 调整内部的 webpack 配置。
  // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
  chainWebpack: config => {
    chunkNameList.forEach(chunk => {
      config.plugins.delete(`preload-${chunk}`)
      config.plugins.delete(`prefetch-${chunk}`)
    })
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      config.mode('production')
    }
    // 单独提取css
    config.plugin('extract-css').tap(options => {
      options = [{
        filename: '[name]/css/app.[contenthash:8].css',
        chunkFilename: 'static/css/common/[id].[contenthash:8].css'
      }]
      return options
    })
    // 提取图片
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options = {
          // 控制图片字符串化的图片大小
          limit: 204800,
          publicPath: process.env.BASE_URL,
          fallback: {
            loader: 'file-loader',
            options: {
              name (file) {
                let imgPath = ''
                let pageImagePath = file.match(/pages\/(\S*)\/\S*.(png|jpe?g|gif|svg)/)
                let componentsImagePath = file.match(/components\/(\S*)\/\S*.(png|jpe?g|gif|svg)/)
                if (pageImagePath) {
                  imgPath = pageImagePath[1]
                } else if (componentsImagePath) {
                  imgPath = 'static/images/common'
                }
                return `${imgPath}/[name].[contenthash:8].[ext]`
              }
            }
          }
        }
        return options
      })
    // 因为是多页面，所以取消 chunks，每个页面只对应一个单独的 JS / CSS
    config.optimization.splitChunks({
      // maxAsyncRequests: 1, // 最大异步请求数，默认5
      // maxInitialRequests: 1,   // 最大初始化请求数，默认3
      cacheGroups: {
        default: false,
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          minChunks: 2 // 模块最小被引用次数
        }
        // styles: {
        //   name: 'styles',
        //   test: /\.s?css$/,
        //   chunks: 'all',
        //   minChunks: 2,
        //   reuseExistingChunk: true,
        //   enforce: true
        // }
      }
    })
  },

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      config = {
        performance: {
          hints: false // 取消打包文件过大的警告
        },
        output: {
          filename: '[name]/js/app.[contenthash:8].js',
          chunkFilename: 'static/js/common/[id].[contenthash:8].js' // chunkhash
        },
        plugins: [
          new HtmlWebpackInlineSourcePlugin(),
          new CompressionWebpackPlugin({
            test: /\.(js|css)(\?.*)?$/i,
            // 需要压缩的文件正则
            threshold: 10240,
            // 文件大小大于这个值时启用压缩
            deleteOriginalAssets: false
            // 压缩后保留原文件
          })
        ]
      }
      return config
    }
  },

  // vue-loader 选项
  // 查阅 https://vue-loader.vuejs.org/zh-cn/options.html
  // vueLoader: {},

  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,

  // CSS 相关选项
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    extract: true,

    // 是否开启 CSS source map？
    sourceMap: false,

    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        data: `@import "@/assets/scss/main.scss";`
      }
    },

    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    modules: false
  },

  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
  // 在多核机器下会默认开启。
  // parallel: require("os").cpus().length > 1,

  // PWA 插件的选项。
  // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli-plugin-pwa/README.md
  // pwa: {},

  // 配置 webpack-dev-server 行为。
  devServer: {
    proxy: {
      '/v1': {
        ws: false, // proxy websockets
        // target: `http://47.74.242.35:10123`,
        target: `http://47.244.1.248:8270`,
        changeOrigin: true,
        pathRewrite: {
          '^/v1': '/v1'
        }
      }
    }
  },

  // 三方插件的选项
  pluginOptions: {}
}
